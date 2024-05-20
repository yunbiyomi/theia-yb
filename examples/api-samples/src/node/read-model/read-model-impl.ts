// *****************************************************************************
// Copyright (C) 2024 TOBESOFT and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
// *****************************************************************************

import { injectable, interfaces } from '@theia/core/shared/inversify';
import { FileNode, ReadModel, ReadModelClient, ReadModelPath, XmlNode } from '../../common/read-model/read-model-service';
import path = require('path');
import fs = require('fs');
import { ConnectionHandler, RpcConnectionHandler } from '@theia/core';
import { buildXML, NpXmlNode, parseXML } from './xml-parser/np-common-xml';

@injectable()
export class ReadModelImpl implements ReadModel {

    protected client: ReadModelClient | undefined;

    setClient(client: ReadModelClient): void {
        this.client = client;
    }

    getClient(): ReadModelClient | undefined {
        if (this.client !== undefined) { return this.client; }
    }

    dispose(): void {
        throw new Error('Method not implemented.');
    }

    // _model_ 폴더 속 폴더 및 파일 파싱해 객체로 저장
    async readModel(): Promise<FileNode[]> {
        const directoryPath = '../../../../Mars_Sample/_model_';
        const modelPath = path.join(__dirname, directoryPath);

        const readDirectory = async (defaultPath: string, parentsFolder?: string): Promise<FileNode[]> => {
            const items = fs.readdirSync(defaultPath, 'utf-8');
            const files: FileNode[] = [];

            for (const item of items) {
                const itemPath = path.join(defaultPath, item);
                const stats = fs.statSync(itemPath);

                if (stats.isDirectory()) {
                    const folderNode: FileNode = {
                        id: item,
                        isDirectory: true,
                        filePath: itemPath,
                        parent: parentsFolder,
                        children: await readDirectory(itemPath, item)
                    };
                    files.push(folderNode);
                } else if (stats.isFile()) {
                    const fileNode: FileNode = {
                        id: item,
                        isDirectory: false,
                        filePath: itemPath
                    };
                    files.push(fileNode);
                }
            }
            return files;
        };

        return readDirectory(modelPath);

    }

    // xml 파일 파싱해 Model 및 Field 객체로 저장
    async parseModel(filePath: string): Promise<XmlNode[]> {
        const nodes: XmlNode[] = [];

        const data = fs.readFileSync(filePath, 'utf-8');

        const xmlDom = parseXML(data);

        const rootNode = xmlDom.getRootNode();
        const modelsNode = rootNode.getChild('Models');
        const modelNode = modelsNode?.getChilds() as NpXmlNode[];

        for (const node of modelNode) {
            const fields: XmlNode[] = [];

            if (node.hasChilds()) {
                const fieldNode = node.getChilds() as NpXmlNode[];

                for (const child of fieldNode) {
                    const xmlFieldNode: XmlNode = {
                        id: child.getAttribute('id'),
                        filePath: filePath,
                        parent: node.getName()
                    }
                    fields.push(xmlFieldNode);
                }
            }

            const xmlModelNode: XmlNode = {
                id: node.getAttribute('id'),
                filePath: filePath,
                parent: modelsNode?.getName(),
                children: fields
            }

            nodes.push(xmlModelNode);
        }


        return nodes;
    }

    // Tabber에서 새로운 노드를 삭제할 때 
    async deleteNode(nodeName: string, path: string, type: string): Promise<string> {
        const data = fs.readFileSync(path, 'utf-8');

        const xmlDom = parseXML(data);

        const rootNode = xmlDom.getRootNode();
        const modelsNode = rootNode.getChild('Models');
        const modelsChild = modelsNode?.getChilds() as NpXmlNode[];

        for (const node of modelsChild) {
            switch (type) {
                case 'model':
                    if (node.getAttribute('id') === nodeName)
                        modelsNode?.removeChild(node);
                    break;
                case 'field':
                    const modelChild = node.getChilds() as NpXmlNode[];
                    for (const modelNode of modelChild) {
                        if (modelNode.getAttribute('id') === nodeName)
                            node.removeChild(modelNode);
                    }
                    break;
                default:
                    break;
            }
        }

        const xmlData = buildXML(xmlDom);
        await fs.writeFileSync(path, xmlData, 'utf-8');

        return xmlData;
    }

    // Tabber에서 새로운 노드를 추가할 때
    async addNode(nodeName: string, path: string, type: string, nodeValue: string): Promise<string> {
        const data = fs.readFileSync(path, 'utf-8');
        const fileNameRegex = /[^\\]+\.xmodel$/;

        const xmlDom = parseXML(data);

        const rootNode = xmlDom.getRootNode();
        const modelsNode = rootNode.getChild('Models') as NpXmlNode;
        const modelsChild = modelsNode?.getChilds() as NpXmlNode[];

        for (const node of modelsChild) {
            switch (type) {
                case 'file':
                    if (fileNameRegex.test(nodeName)) {
                        const newModelNode = modelsNode.appendChild('Model');
                        if (newModelNode) {
                            newModelNode.setAttribute('id', nodeValue);
                        }
                    }
                    break;
                case 'model':
                    const modelName = node.getAttribute('id');
                    if (modelName === nodeName) {
                        const newFieldNode = node.appendChild('Field');
                        if (newFieldNode) {
                            newFieldNode.setAttribute('id', nodeValue);
                        }
                    }
                    break
                default:
                    break;
            }
        }

        const xmlData = buildXML(xmlDom);

        return xmlData;
    }
}

export const bindReadModelWidgetBackend = (bind: interfaces.Bind) => {
    bind(ReadModel).to(ReadModelImpl).inSingletonScope();
    bind(ConnectionHandler).toDynamicValue(ctx =>
        new RpcConnectionHandler<ReadModelClient>(ReadModelPath, client => {
            const server = ctx.container.get<ReadModel>(ReadModel);
            server.setClient(client);
            return server;
        })
    ).inSingletonScope();
}

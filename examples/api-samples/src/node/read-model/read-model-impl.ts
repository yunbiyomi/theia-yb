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
import { ParseNode, ReadModel, ReadModelClient, ReadModelPath } from '../../common/read-model/read-model-service';
import path = require('path');
import fs = require('fs');
import { ConnectionHandler, RpcConnectionHandler } from '@theia/core';
import { buildXML, NpXmlNode, parseXML } from './xml-parser/np-common-xml';

@injectable()
export class ReadModelImpl implements ReadModel {

    protected client: ReadModelClient | undefined;
    protected FilesMap: Map<string, string>;

    setClient(client: ReadModelClient): void {
        this.client = client;
    }

    getClient(): ReadModelClient | undefined {
        if (this.client !== undefined) { return this.client; }
    }

    protected setFileData(filePath: string, data: string): Map<string, string> {
        return this.FilesMap.set(filePath, data);
    }

    protected getFileData(filePath: string): string | undefined {
        if (this.FilesMap.has(`${filePath}`)) {
            return this.FilesMap.get(`${filePath}`) as string;
        } else {
            return undefined
        }
    }

    dispose(): void {
        throw new Error('Method not implemented.');
    }

    // _model_ 폴더 속 폴더 및 파일 파싱해 객체로 저장
    async readModel(): Promise<ParseNode[]> {
        const directoryPath = '../../../../Mars_Sample/_model_';
        const modelPath = path.join(__dirname, directoryPath);
        const fileContents = new Map<string, string>();

        const readDirectory = async (defaultPath: string, parentsFolder?: string): Promise<ParseNode[]> => {
            const items = fs.readdirSync(defaultPath, 'utf-8');
            const files: ParseNode[] = [];

            for (const item of items) {
                const itemPath = path.join(defaultPath, item);
                const stats = fs.statSync(itemPath);

                if (stats.isDirectory()) {
                    const folderNode: ParseNode = {
                        id: item,
                        filePath: itemPath,
                        parseType: 'readModel',
                        isDirectory: true,
                        parent: parentsFolder,
                        children: await readDirectory(itemPath, item)
                    };

                    files.push(folderNode);
                } else if (stats.isFile()) {
                    const fileContent = fs.readFileSync(itemPath, 'utf-8');
                    fileContents.set(itemPath, fileContent);
                    const fileNode: ParseNode = {
                        id: item,
                        filePath: itemPath,
                        parseType: 'readModel',
                        isDirectory: false,
                    };

                    files.push(fileNode);
                }
            }
            return files;
        };

        this.FilesMap = fileContents;
        return readDirectory(modelPath);
    }

    // xml 파일 파싱해 Model 및 Field 객체로 저장
    async parseModel(filePath: string): Promise<ParseNode[]> {
        const domNodes: ParseNode[] = [];
        const data = this.getFileData(filePath) as string;

        const xmlDom = parseXML(data);
        const rootNode = xmlDom.getRootNode();
        const modelsNode = rootNode.getChild('Models');
        const modelNode = modelsNode?.getChilds() as NpXmlNode[];

        for (const node of modelNode) {
            const fields: ParseNode[] = [];

            if (node.hasChilds()) {
                const fieldNode = node.getChilds() as NpXmlNode[];

                for (const child of fieldNode) {
                    const xmlFieldNode: ParseNode = {
                        id: child.getAttribute('id') as string,
                        filePath: filePath,
                        parseType: 'readXml',
                        parent: node.getName()
                    }
                    fields.push(xmlFieldNode);
                }
            }

            const xmlModelNode: ParseNode = {
                id: node.getAttribute('id') as string,
                filePath: filePath,
                parseType: 'readXml',
                parent: modelsNode?.getName(),
                children: fields
            }

            domNodes.push(xmlModelNode);
        }

        return domNodes;
    }

    // Tabber에서 새로운 노드를 삭제할 때 
    deleteNode(nodeName: string, path: string, type: string, parentName: string): boolean {
        const data = this.getFileData(path) as string;
        const xmlDom = parseXML(data);

        const rootNode = xmlDom.getRootNode();
        const modelsNode = rootNode.getChild('Models');
        const modelsChild = modelsNode?.getChilds() as NpXmlNode[];

        let nodeToRemove: NpXmlNode | undefined;

        switch (type) {
            case 'model':
                nodeToRemove = modelsChild.find(node => node.getAttribute('id') === nodeName) as NpXmlNode;
                if (nodeToRemove && modelsNode) {
                    modelsNode.removeChild(nodeToRemove);
                }
                break;
            case 'field':
                const parentModel = modelsChild.find(node => node.getAttribute('id') === parentName) as NpXmlNode;
                if (parentModel) {
                    const modelChild = parentModel.getChilds() as NpXmlNode[];
                    nodeToRemove = modelChild.find(node => node.getAttribute('id') === nodeName) as NpXmlNode;
                    if (nodeToRemove) {
                        parentModel.removeChild(nodeToRemove);
                    }
                }
                break;
            default:
                return false;
        }

        if (nodeToRemove) {
            const xmlData = buildXML(xmlDom);
            this.setFileData(path, xmlData);
            fs.writeFileSync(path, xmlData, 'utf-8');
            return true;
        } else {
            return false;
        }
    }


    // Tabber에서 새로운 노드를 추가할 때
    addNode(nodeName: string, path: string, type: string, nodeValue: string): boolean {
        const data = this.getFileData(path) as string;
        const xmlDom = parseXML(data);

        const rootNode = xmlDom.getRootNode();
        const modelsNode = rootNode.getChild('Models') as NpXmlNode;
        const modelsChild = modelsNode?.getChilds() as NpXmlNode[];

        let nodeToAdd: NpXmlNode | undefined;

        switch (type) {
            case 'file':
                nodeToAdd = modelsNode.appendChild('Model');
                if (nodeToAdd) {
                    nodeToAdd.setAttribute('id', nodeValue);
                }
                break;
            case 'model':
                const parentModelNode = modelsChild.find(node => node.getAttribute('id') === nodeName) as NpXmlNode;
                nodeToAdd = parentModelNode.appendChild('Field');
                if (nodeToAdd) {
                    nodeToAdd.setAttribute('id', nodeValue);
                }
                break;
            default:
                return false
        }

        if (nodeToAdd) {
            const xmlData = buildXML(xmlDom);
            this.setFileData(path, xmlData);
            fs.writeFileSync(path, xmlData, 'utf-8');
            return true;
        } else {
            return false;
        }
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

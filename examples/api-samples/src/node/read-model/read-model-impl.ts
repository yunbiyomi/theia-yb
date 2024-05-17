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
import { parseXML } from './xml-parser/np-common-xml';

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
        const modelNode = modelsNode?.getChilds();

        if (modelNode) {
            for (const node of modelNode) {
                const fields: XmlNode[] = [];

                if (node.hasChilds()) {
                    const fieldNode = node.getChilds();
                    if (fieldNode) {
                        for (const child of fieldNode) {
                            const xmlFieldNode: XmlNode = {
                                id: child.getAttribute('id'),
                                parent: node.getName()
                            }
                            fields.push(xmlFieldNode);
                        }
                    }
                }

                const xmlModelNode: XmlNode = {
                    id: node.getAttribute('id'),
                    parent: modelsNode?.getName(),
                    children: fields
                }
                nodes.push(xmlModelNode);
            }
        }

        return nodes;
    }

    async deleteNode(): Promise<string> {
        return 'undefined';
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

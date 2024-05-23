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
import { ParseNode, parseType, ReadModel, ReadModelClient, ReadModelPath } from '../../common/read-model/read-model-service';
import path = require('path');
import fs = require('fs');
import { ConnectionHandler, RpcConnectionHandler } from '@theia/core';
import { buildXML, NpXmlDom, NpXmlNode, parseXML } from './xml-parser/np-common-xml';

@injectable()
export class ReadModelImpl implements ReadModel {

    protected client: ReadModelClient | undefined;
    protected FilesMap: Map<string, NpXmlDom>;

    dispose(): void {
        throw new Error('Method not implemented.');
    }

    setClient(client: ReadModelClient): void {
        this.client = client;
    }

    getClient(): ReadModelClient | undefined {
        if (this.client !== undefined) { return this.client; }
    }

    protected setFileDom(filePath: string, data: NpXmlDom): Map<string, NpXmlDom> {
        return this.FilesMap.set(filePath, data);
    }

    protected getFileDom(filePath: string): NpXmlDom | undefined {
        if (this.FilesMap.has(`${filePath}`)) {
            return this.FilesMap.get(`${filePath}`)
        } else {
            return undefined
        }
    }

    protected createParseNode(id: string, filePath: string, parseType: parseType, isDirectory?: boolean, parent?: string, children?: ParseNode[]): ParseNode {
        return {
            id,
            filePath,
            parseType,
            isDirectory,
            parent,
            children
        }
    }

    // _model_ 폴더 속 폴더 및 파일 파싱해 객체로 저장
    async readModel(): Promise<ParseNode[]> {
        const directoryPath = '../../../../Mars_Sample/_model_';
        const modelPath = path.join(__dirname, directoryPath);
        const fileContents = new Map<string, NpXmlDom>();

        const readDirectory = async (defaultPath: string, parentsFolder?: string): Promise<ParseNode[]> => {
            const items = fs.readdirSync(defaultPath, 'utf-8');
            const files: ParseNode[] = [];

            for (const item of items) {
                const itemPath = path.join(defaultPath, item);
                const stats = fs.statSync(itemPath);

                if (stats.isDirectory()) {
                    const children = await readDirectory(itemPath, item);
                    const folderNode = this.createParseNode(item, itemPath, 'readModel', true, parentsFolder, children);
                    files.push(folderNode);
                } else if (stats.isFile()) {
                    // 각 파일 content NpXmlDom 형태로 저장
                    const fileContent = fs.readFileSync(itemPath, 'utf-8');
                    const parseFileContent = parseXML(fileContent);
                    fileContents.set(itemPath, parseFileContent);

                    const fileNode = this.createParseNode(item, itemPath, 'readModel', false);
                    files.push(fileNode);
                }
            }
            return files;
        };

        this.FilesMap = fileContents;
        return readDirectory(modelPath);
    }

    // xml 파일 파싱해 Model 및 Field 객체로 저장
    async parseModel(filePath: string): Promise<ParseNode[] | undefined> {
        const domNodes: ParseNode[] = [];
        const xmlDom = this.getFileDom(filePath);

        if (!xmlDom) {
            return;
        }

        const rootNode = xmlDom.getRootNode();
        const modelsNode = rootNode.getChild('Models');
        const modelNode = modelsNode?.getChilds() as NpXmlNode[];

        for (const node of modelNode) {
            const fields: ParseNode[] = [];

            if (node.hasChilds()) {
                const fieldNode = node.getChilds() as NpXmlNode[];

                for (const child of fieldNode) {
                    const childId = child.getAttribute('id');
                    const fieldParent = node.getName();

                    if (!childId) {
                        return;
                    }

                    const xmlFieldNode = this.createParseNode(childId, filePath, 'readXml', undefined, fieldParent);
                    fields.push(xmlFieldNode);
                }
            }

            const modelId = node.getAttribute('id');
            const modelParent = modelsNode?.getName();

            if (!modelId) {
                return;
            }

            const xmlModelNode = this.createParseNode(modelId, filePath, 'readXml', undefined, modelParent, fields);
            domNodes.push(xmlModelNode);
        }

        return domNodes;
    }

    // Tabber에서 새로운 노드를 삭제할 때
    async deleteNode(nodeName: string, filePath: string, type: string, parentName: string): Promise<boolean> {
        const xmlDom = this.getFileDom(filePath);

        if (!xmlDom) {
            return false
        }

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
            this.setFileDom(filePath, xmlDom);
            const xmlData = buildXML(xmlDom);
            fs.writeFileSync(filePath, xmlData, 'utf-8');
            return true;
        } else {
            return false;
        }
    }

    // 아이디 유효성 검사
    async checkIdRegex(nodeValue: string): Promise<boolean> {
        const idRegex = /^[A-Za-z][A-Za-z0-9_]*$/;
        const regexResult = idRegex.test(nodeValue);

        if (!regexResult) {
            return false;
        }

        let duplicationResult = false;

        for (const [, content] of this.FilesMap) {
            const xmlDom = content;
            const rootNode = xmlDom.getRootNode();
            const modelsNode = rootNode.getChild('Models');
            const modelsChild = modelsNode?.getChilds() as NpXmlNode[];

            if (!modelsChild) {
                continue;
            }

            const modelDuplication = modelsChild.some(node => node.getAttribute('id') === nodeValue);
            if (modelDuplication) {
                duplicationResult = true;
                break;
            }

            for (const model of modelsChild) {
                if (model.hasChilds()) {
                    const fields = model.getChilds() as NpXmlNode[];
                    const fieldDuplication = fields.some(node => node.getAttribute('id') === nodeValue);
                    if (fieldDuplication) {
                        duplicationResult = true;
                        break;
                    }
                }
            }

            if (duplicationResult) {
                break;
            }
        }


        return !duplicationResult;
    }



    // Tabber에서 새로운 노드를 추가할 때
    async addNode(nodeName: string, filePath: string, type: string, nodeValue: string): Promise<boolean> {
        const xmlDom = this.getFileDom(filePath);

        if (!xmlDom) {
            return false
        }

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
                return false;
        }

        if (nodeToAdd) {
            this.setFileDom(filePath, xmlDom);
            const xmlData = buildXML(xmlDom);
            fs.writeFileSync(filePath, xmlData, 'utf-8');
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
};

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

    // 코드 에디터에서 save 동작 시 수정된 파일 내용 Map에 반영
    async readChangeFile(filePath: string): Promise<boolean> {
        if (this.FilesMap.has(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const parseFileContent = parseXML(fileContent);

            this.setFileDom(filePath, parseFileContent);

            return true
        } else {
            return false
        }
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

    // delete tabber 클릭 시
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

    // ID 중복 검사
    private isIdDuplicate(nodeValue: string): boolean {
        for (const [, content] of this.FilesMap) {
            const xmlDom = content;
            const rootNode = xmlDom.getRootNode();
            const modelsNode = rootNode.getChild('Models');
            const modelsChild = modelsNode?.getChilds() as NpXmlNode[];

            if (!modelsChild) {
                continue;
            }

            if (this.isDuplicateInNodes(modelsChild, nodeValue)) {
                return true;
            }
        }

        return false;
    }


    private isDuplicateInNodes(nodes: NpXmlNode[], nodeValue: string): boolean {
        for (const node of nodes) {
            if (node.getAttribute('id') === nodeValue) {
                return true;
            }

            if (node.hasChilds()) {
                const childNodes = node.getChilds() as NpXmlNode[];
                if (this.isDuplicateInNodes(childNodes, nodeValue)) {
                    return true;
                }
            }
        }

        return false;
    }


    // 아이디 유효성 검사
    async checkIdRegex(nodeValue: string): Promise<{ isValid: boolean; errorMsg?: string }> {
        // 아이디 생성 규칙 검사
        const idRegex = /^[A-Za-z][A-Za-z0-9_]*$/;
        const regexResult = idRegex.test(nodeValue);

        if (!regexResult) {
            return {
                isValid: false,
                errorMsg: '아이디 생성 규칙에 적합하지 않아 노드를 추가할 수 없습니다. 영어 대/소문자 및 숫자, _ 기호만 사용 가능합니다.'
            };
        }

        // 아이디 중복 검사
        const isDuplicate = this.isIdDuplicate(nodeValue);
        if (isDuplicate) {
            return {
                isValid: false,
                errorMsg: '이미 중복된 아이디가 존재해 노드를 추가할 수 없습니다.'
            };
        }

        // 아이디 최대 길이 검사
        if (nodeValue.length > 255) {
            return {
                isValid: false,
                errorMsg: 'Id 길이가 너무 길어 노드를 추가할 수 없습니다. 최대 255자까지 가능합니다.'
            };
        }

        return { isValid: true };
    }



    // add tabbar 클릭 시
    async addNodeServer(nodeName: string, filePath: string, type: string, nodeValue: string, parentName?: string, isUndoRedo?: boolean, insertIndex?: number): Promise<boolean> {
        const xmlDom = this.getFileDom(filePath);

        if (!xmlDom) {
            return false
        }

        const rootNode = xmlDom.getRootNode();
        const modelsNode = rootNode.getChild('Models') as NpXmlNode;
        const modelsChild = modelsNode?.getChilds() as NpXmlNode[];

        let nodeToAdd: NpXmlNode | undefined;

        switch (type) {
            case 'folder':
                break;
            case 'file':
                nodeToAdd = modelsNode.appendChild('Model');
                break;
            case 'model':
                if (isUndoRedo) {
                    if (insertIndex) {
                        nodeToAdd = modelsNode.insertChild('Model', insertIndex);
                    } else {
                        nodeToAdd = modelsNode.appendChild('Model');
                    }
                }
                else {
                    const parentModelNode = modelsChild.find(node => node.getAttribute('id') === nodeName) as NpXmlNode;
                    nodeToAdd = parentModelNode.appendChild('Field');
                }
                break;
            case 'field':
                const parentNode = modelsChild.find(node => node.getAttribute('id') === parentName) as NpXmlNode;
                const modelChild = parentNode.getChilds() as NpXmlNode[];
                if (isUndoRedo && insertIndex) {
                    nodeToAdd = parentNode.insertChild('Field', insertIndex);
                } else {
                    const currentNodeIndex = modelChild.find(node => node.getAttribute('id') === nodeName)?.getIndex() as number;
                    nodeToAdd = parentNode.insertChild('Field', currentNodeIndex);
                }
                break;
        }

        if (nodeToAdd) {
            nodeToAdd.setAttribute('id', nodeValue);
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

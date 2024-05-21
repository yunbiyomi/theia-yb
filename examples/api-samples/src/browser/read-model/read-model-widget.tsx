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

import * as React from '@theia/core/shared/react';
import { Container, inject, injectable, interfaces, postConstruct } from '@theia/core/shared/inversify';
// eslint-disable-next-line max-len
import { codicon, CompositeTreeNode, ContextMenuRenderer, createTreeContainer, ExpandableTreeNode, LabelProvider, NodeProps, SelectableTreeNode, TreeImpl, TreeModel, TreeModelImpl, TreeNode, TreeProps, TreeWidget, URIIconReference, WidgetManager } from '@theia/core/lib/browser';
import { ParseNode, ReadModel } from '../../common/read-model/read-model-service';
import { URI } from '@theia/core';

export interface TypeNode extends SelectableTreeNode, CompositeTreeNode {
    type: string;
}

export interface ExpandTypeNode extends TypeNode, ExpandableTreeNode {
}

@injectable()
export class ReadModelWidget extends TreeWidget {

    static readonly ID = 'read-model-widget';
    static readonly LABEL = 'Read Model';

    @inject(LabelProvider) protected override readonly labelProvider: LabelProvider;

    static createContainer(parent: interfaces.Container): Container {
        const child = createTreeContainer(parent, {
            tree: TreeImpl,
            widget: ReadModelWidget,
            model: ReadModelTreeModel
        });

        return child;
    }

    static createWidget(parent: interfaces.Container): ReadModelWidget {
        return ReadModelWidget.createContainer(parent).get(ReadModelWidget);
    }

    constructor(
        @inject(TreeProps) props: TreeProps,
        @inject(TreeModel) override readonly model: TreeModel,
        @inject(ContextMenuRenderer) contextMenuRenderer: ContextMenuRenderer,
    ) {
        super(props, model, contextMenuRenderer);
    }

    @postConstruct()
    protected override init(): void {
        super.init();
        this.doInit();
    }

    protected doInit(): void {
        this.id = ReadModelWidget.ID;
        this.title.label = ReadModelWidget.LABEL;
        this.title.caption = ReadModelWidget.LABEL;
        this.title.closable = true;
        this.title.iconClass = 'fa fa-tree';

        this.model.root = undefined;
        this.model.refresh();
    }

    // model Root 생성
    protected createRootNode(): ExpandableTreeNode {
        return {
            id: 'model-tree',
            name: '_model_',
            parent: undefined,
            icon: 'codicon codicon-folder default-folder-icon',
            visible: true,
            expanded: false,
            children: []
        };
    }

    createTypeNode(fileNode: ParseNode, icon: string, parent: ExpandTypeNode, type: string): TypeNode {
        return {
            id: fileNode.id,
            name: fileNode.id,
            icon,
            description: fileNode.filePath,
            parent,
            children: [],
            type,
            selected: false,
        }
    }

    createExpandTypeNode(fileNode: ParseNode, icon: string, parent: ExpandTypeNode, type: string): ExpandTypeNode {
        return {
            id: fileNode.id,
            name: fileNode.id,
            icon,
            description: fileNode.filePath,
            parent,
            children: [],
            type,
            expanded: false,
            selected: false
        };
    }

    // 폴더 파싱한 결과를 바탕으로 폴더 및 파일 Node 생성
    protected createTreeNode(parseNode: ParseNode, parent: ExpandTypeNode): TreeNode | undefined {
        const parseType = parseNode.parseType;
        let nodeChilds: TreeNode[] = [];

        switch (parseType) {
            case 'readModel':
                const nodePath: URI = new URI(parseNode.filePath);
                const nodeType: URIIconReference = parseNode.isDirectory ? URIIconReference.create('folder', nodePath) : URIIconReference.create('file', nodePath);
                const nodeIcon = this.labelProvider.getIcon(nodeType);

                const fileNode = this.createExpandTypeNode(parseNode, nodeIcon, parent, 'file');

                if (parseNode.children && Array.isArray(parseNode.children)) {
                    const folderNode = this.createExpandTypeNode(parseNode, nodeIcon, parent, 'folder');

                    for (const child of parseNode.children) {
                        const childNode = this.createTreeNode(child, folderNode);
                        if (childNode) {
                            nodeChilds.push(childNode);
                        }
                    }

                    folderNode.children = nodeChilds;
                    return folderNode;
                }

                return fileNode;
            case 'readXml':
                const fieldIcon = codicon('circle-small');
                const fieldNode = this.createTypeNode(parseNode, fieldIcon, parent, 'field');

                if (parseNode.children && Array.isArray(parseNode.children)) {
                    const modelIcon = codicon('symbol-field');
                    const modelNode = this.createExpandTypeNode(parseNode, modelIcon, parent, 'model');

                    for (const child of parseNode.children) {
                        const childNode = this.createTreeNode(child, modelNode);
                        if (childNode) {
                            nodeChilds.push(childNode);
                        }
                    }

                    modelNode.children = nodeChilds;
                    return modelNode;
                }

                return fieldNode;
            default:
                return undefined
        }
    }

    // 가져온 FileNode를 바탕으로 Node 추가
    async getReadModel(fileNode: ParseNode[]): Promise<void> {
        const root = this.createRootNode() as ExpandTypeNode;

        fileNode.forEach((file: ParseNode) => {
            const node = this.createTreeNode(file, root) as TreeNode;
            CompositeTreeNode.addChild(root, node);
        });

        this.model.root = root;
        await this.model.refresh();
    }

    // 가져온 XmlNode를 바탕으로 Node 추가
    async getReadXml(xmlNode: ParseNode[], rootNode: ExpandTypeNode): Promise<void> {
        xmlNode.forEach((xml: ParseNode) => {
            const node = this.createTreeNode(xml, rootNode) as TreeNode;
            CompositeTreeNode.addChild(rootNode, node);
        });

        await this.model.refresh();
    }


    // 각 Node에 알맞는 아이콘 render
    protected override renderIcon(node: TreeNode, props: NodeProps): React.ReactNode {
        const icon = this.toNodeIcon(node);
        if (icon) {
            return <div className={icon + ' file-icon'}></div>;
        }
        return undefined;
    }

    // 선택한 Node 삭제
    async deleteNode(selectNode: TreeNode): Promise<void> {
        const parentsNode = selectNode.parent as CompositeTreeNode;

        CompositeTreeNode.removeChild(parentsNode, selectNode);

        if (selectNode.nextSibling) {
            this.model.selectNextNode();
        } else {
            this.model.selectPrevNode();
        }

        await this.model.refresh();
    }

    // 새로운 Node 추가
    async addNewNode(selectNode: ExpandTypeNode | TypeNode, type: string, value: string | undefined): Promise<void> {
        const root = selectNode as ExpandTypeNode;
        const path = root.description;
        const newNodeinfo = { id: value, filePath: path } as ParseNode;

        switch (type) {
            case 'file':
                const modelIcon = codicon('symbol-field');
                const nodeType = 'model';
                const modelNode = this.createExpandTypeNode(newNodeinfo, modelIcon, root, nodeType);
                CompositeTreeNode.addChild(root, modelNode);
                break;
            case 'model':
                const fieldIcon = codicon('circle-small');
                const fieldType = 'field';
                const fieldNode = this.createTypeNode(newNodeinfo, fieldIcon, root, fieldType);
                CompositeTreeNode.addChild(root, fieldNode);
                break;
            default:
                break;
        }

        await this.model.refresh();
    }
}

@injectable()
export class ReadModelTreeModel extends TreeModelImpl {

    @inject(LabelProvider) protected readonly labelProvider: LabelProvider;
    @inject(ReadModel) protected readonly readModel: ReadModel;
    @inject(WidgetManager) protected readonly widgetManager: WidgetManager;

    // Node 더블 클릭시 
    protected override doOpenNode(node: ExpandTypeNode): void {
        super.doOpenNode(node);

        // Xml파일인 경우
        if (node.id.includes('.xmodel')) {
            const filePath = this.labelProvider.getLongName(node);
            this.readModel.parseModel(filePath).then((xmlNodes: ParseNode[]) => {
                const readModelWidgets = this.widgetManager.getWidgets(ReadModelWidget.ID) as ReadModelWidget[];
                readModelWidgets.forEach(widget => {
                    widget.getReadXml(xmlNodes, node);
                });
            });
        }
    }
}

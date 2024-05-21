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
import { FileNode, ReadModel, XmlNode } from '../../common/read-model/read-model-service';
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

    // 폴더 파싱한 결과를 바탕으로 폴더 및 파일 Node 생성
    protected createTreeNode(fileNode: FileNode, parent: ExpandableTreeNode): TreeNode {
        const newChildren: TreeNode[] = [];

        // Node 타입 분류하기
        const nodePath: URI = new URI(fileNode.filePath);
        const nodeType: URIIconReference = fileNode.isDirectory ? URIIconReference.create('folder', nodePath) : URIIconReference.create('file', nodePath);

        const node: ExpandTypeNode = {
            id: fileNode.id,
            name: fileNode.id,
            icon: this.labelProvider.getIcon(nodeType),
            description: fileNode.filePath,
            expanded: false,
            parent: parent,
            children: newChildren,
            type: 'file',
            selected: false
        };

        // children이 존재하는 Node의 경우
        if (fileNode.children && Array.isArray(fileNode.children)) {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const node: ExpandableTreeNode = {
                id: fileNode.id,
                name: fileNode.id,
                icon: this.labelProvider.getIcon(nodeType),
                description: fileNode.filePath,
                expanded: false,
                parent: parent,
                children: newChildren
            };

            for (const child of fileNode.children) {
                const childNode: TreeNode = this.createTreeNode(child, node);
                newChildren.push(childNode);
            }
            return node;
        }

        return node;
    }

    // 가져온 FileNode를 바탕으로 Node 추가
    async getReadModel(fileNode: FileNode[]): Promise<void> {
        const root = this.createRootNode();

        fileNode.forEach((file: FileNode) => {
            const node = this.createTreeNode(file, root);
            CompositeTreeNode.addChild(root, node);
        });

        this.model.root = root;
        await this.model.refresh();
    }

    // xml파일을 파싱한 결과를 바탕으로 속성 Node 생성
    protected createXmlNode(xmlNode: XmlNode, parent: ExpandTypeNode): TreeNode {
        const newChildren: TreeNode[] = [];

        const node: TypeNode = {
            id: xmlNode.id as string,
            name: xmlNode.id,
            icon: codicon('circle-small'),
            description: xmlNode.filePath,
            parent: parent,
            children: [],
            selected: false,
            type: 'field'
        };

        // children이 존재하는 Node의 경우
        if (xmlNode.children && Array.isArray(xmlNode.children)) {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const node: ExpandTypeNode = {
                id: xmlNode.id as string,
                name: xmlNode.id,
                description: xmlNode.filePath,
                expanded: false,
                parent: parent,
                children: newChildren,
                selected: false,
                type: 'model'
            };

            for (const child of xmlNode.children) {
                const childNode: TreeNode = this.createXmlNode(child, node);
                newChildren.push(childNode);
            }
            return node;
        }

        return node;
    }

    // 가져온 XmlNode를 바탕으로 Node 추가
    async getReadXml(xmlNode: XmlNode[], rootNode: ExpandTypeNode): Promise<void> {
        xmlNode.forEach((xml: XmlNode) => {
            const node = this.createXmlNode(xml, rootNode);
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

        await this.model.refresh();
    }

    async addNewNode(selectNode: CompositeTreeNode, type: string, value: string | undefined): Promise<void> {
        const root = selectNode;
        const path = root.description;

        // 새로운 Model을 추가할 때
        if (type === 'file') {
            const newnNode: ExpandTypeNode = {
                id: value as string,
                name: value,
                expanded: false,
                description: path,
                parent: root,
                children: [],
                selected: false,
                type: 'model'
            };

            CompositeTreeNode.addChild(root, newnNode);
        }

        // 새로운 Field을 추가할 때
        if (type === 'model') {
            const newNode: TypeNode = {
                id: value as string,
                name: value,
                description: path,
                icon: codicon('circle-small'),
                parent: root,
                children: [],
                selected: false,
                type: 'field'
            };

            CompositeTreeNode.addChild(root, newNode);
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
            this.readModel.parseModel(filePath).then((xmlNodes: XmlNode[]) => {
                const readModelWidgets = this.widgetManager.getWidgets(ReadModelWidget.ID) as ReadModelWidget[];
                readModelWidgets.forEach(widget => {
                    widget.getReadXml(xmlNodes, node);
                });
            });
        }
    }
}

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
import { ApplicationShell, codicon, CompositeTreeNode, ContextMenuRenderer, createTreeContainer, ExpandableTreeNode, LabelProvider, NodeProps, SelectableTreeNode, TreeImpl, TreeModel, TreeModelImpl, TreeNode, TreeProps, TreeWidget, URIIconReference, WidgetManager } from '@theia/core/lib/browser';
import { nodeType, ParseNode, ReadModel } from '../../common/read-model/read-model-service';
import { URI } from '@theia/core';

export interface TypeNode extends SelectableTreeNode, CompositeTreeNode {
    type: nodeType;
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
    protected createRootNode(): ExpandTypeNode {
        return {
            id: 'model-tree',
            name: '_model_',
            parent: undefined,
            icon: 'codicon codicon-folder default-folder-icon',
            visible: true,
            expanded: false,
            children: [],
            type: 'mainRoot',
            selected: false
        };
    }

    createTypeNode(parseNode: ParseNode, icon: string, parent: ExpandTypeNode, type: nodeType): TypeNode {
        return {
            id: parseNode.id,
            name: parseNode.id,
            icon,
            description: parseNode.filePath,
            parent,
            children: [],
            type,
            selected: false,
        };
    }

    createExpandTypeNode(parseNode: ParseNode, icon: string, parent: ExpandTypeNode, type: nodeType): ExpandTypeNode {
        return {
            id: parseNode.id,
            name: parseNode.id,
            icon,
            description: parseNode.filePath,
            parent,
            children: [],
            type,
            expanded: false,
            selected: false
        };
    }

    // 자식이 있는 node의 자식 node 추가 함수
    createChildNodes(parseNode: ParseNode, nodeIcon: string, parent: ExpandTypeNode, type: nodeType): ExpandTypeNode {
        const nodeChilds: TreeNode[] = [];
        const parentNode = this.createExpandTypeNode(parseNode, nodeIcon, parent, type);
        const parentNodeChildren = parseNode.children as ParseNode[];

        for (const child of parentNodeChildren) {
            const childNode = this.createTreeNode(child, parentNode);
            if (childNode) {
                nodeChilds.push(childNode);
            }
        }

        parentNode.children = nodeChilds;

        return parentNode
    }

    // 폴더 파싱한 결과를 바탕으로 폴더 및 파일 Node 생성
    protected createTreeNode(parseNode: ParseNode, parent: ExpandTypeNode): TreeNode | undefined {
        const parseType = parseNode.parseType;

        switch (parseType) {
            case 'readModel':
                const nodePath: URI = new URI(parseNode.filePath);
                const nodeType: URIIconReference = parseNode.isDirectory ? URIIconReference.create('folder', nodePath) : URIIconReference.create('file', nodePath);
                const nodeIcon = this.labelProvider.getIcon(nodeType);

                let fileNode = this.createExpandTypeNode(parseNode, nodeIcon, parent, 'file');

                if (parseNode.children && Array.isArray(parseNode.children)) {
                    fileNode = this.createChildNodes(parseNode, nodeIcon, parent, 'folder');
                    return fileNode
                }

                return fileNode;
            case 'readXml':
                const nodeChilds: TreeNode[] = [];
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
                return undefined;
        }
    }

    // 노드에 selected / focus 추가
    protected selectNodeHandle(selectedNode: SelectableTreeNode): void {
        this.model.selectNode(selectedNode);
        this.focusService.setFocus(selectedNode);
        this.node.focus();
    };

    // 가져온 FileNode를 바탕으로 Node 추가
    async getReadTree(parseNodes: ParseNode[], type: string, rootNode?: ExpandTypeNode): Promise<void> {
        let root: ExpandTypeNode;

        switch (type) {
            case 'readModel':
                root = this.createRootNode();
                this.model.root = root;
                break;
            case 'readXml':
                if (rootNode) {
                    root = rootNode;
                }
                break;
            default:
                break;
        }

        parseNodes.forEach((node: ParseNode) => {
            const newNode = this.createTreeNode(node, root);
            if (newNode) {
                CompositeTreeNode.addChild(root, newNode);
            }
        });

        if (root!) {
            await this.model.refresh();
        }
    }

    // 선택한 Node 삭제
    async deleteNode(selectNode: TreeNode): Promise<void> {
        const parentsNode = selectNode.parent as CompositeTreeNode;
        CompositeTreeNode.removeChild(parentsNode, selectNode);

        const nextNode = selectNode.nextSibling as SelectableTreeNode;
        if (nextNode) {
            this.selectNodeHandle(nextNode);
        } else {
            const prevNode = selectNode.previousSibling as SelectableTreeNode;
            if (prevNode) {
                this.selectNodeHandle(prevNode);
            } else {
                const parentNode = SelectableTreeNode.getVisibleParent(selectNode);
                if (parentNode) {
                    this.selectNodeHandle(parentNode);
                }
            }
        }

        await this.model.refresh();
    }

    // 새로운 Node 추가
    async addNewNode(selectNode: ExpandTypeNode, type: string, value: string): Promise<void> {
        const root = selectNode;
        const path = this.labelProvider.getLongName(root);
        const newNodeinfo = { id: value, filePath: path } as ParseNode;
        let newAddNode: TypeNode | ExpandTypeNode;

        switch (type) {
            case 'folder':
                break;
            case 'file':
                const modelIcon = codicon('symbol-field');
                const nodeType = 'model';
                newAddNode = this.createExpandTypeNode(newNodeinfo, modelIcon, root, nodeType);
                break;
            case 'model':
                const fieldIcon = codicon('circle-small');
                const fieldType = 'field';
                newAddNode = this.createTypeNode(newNodeinfo, fieldIcon, root, fieldType);
                break;
            case 'field':
                break;
            default:
                break;
        }

        if (newAddNode!) {
            CompositeTreeNode.addChild(root, newAddNode);
            this.model.refresh();
            this.selectNodeHandle(newAddNode);
        }

        // root가 접혀있을 때 node 추가시 펴주기
        if (!root.expanded) {
            this.model.expandNode(root);
        }

        await this.model.refresh();
    }

    // 각 Node에 알맞는 아이콘 render
    protected override renderIcon(node: TypeNode): React.ReactNode {
        const icon = this.toNodeIcon(node);
        if (node.type === 'model') {
            return <div className={icon + ' file-icon'} style={{ paddingRight: '5px' }}></div>;
        } else if (icon) {
            return <div className={icon + ' file-icon'}></div>;
        }
        return undefined;
    }

    protected override renderExpansionToggle(node: ExpandTypeNode, props: NodeProps): React.ReactNode {
        // expand node child 없는 경우 토글 버튼 숨겨주기
        if (ExpandableTreeNode.is(node)) {
            if (!node.children || node.children.length === 0) {
                const classes = 'theia-TreeNodeSegment theia-ExpansionToggle';
                return <div data-node-id={node.id} className={classes} style={{ visibility: 'hidden' }} />;
            }
        }
        return super.renderExpansionToggle(node, props);
    }

    // 트리 위젯 초기화
    override restoreState(oldState: object): void {
        super.restoreState(oldState);

        const { root, model } = (oldState as any);
        if (root) {
            this.model.root = undefined;
        }
        if (model) {
            this.model.clearSelection();
        }
    }

}

@injectable()
export class ReadModelTreeModel extends TreeModelImpl {

    @inject(LabelProvider) protected readonly labelProvider: LabelProvider;
    @inject(ReadModel) protected readonly readModel: ReadModel;
    @inject(WidgetManager) protected readonly widgetManager: WidgetManager;
    @inject(ApplicationShell) protected readonly applicationShell: ApplicationShell;

    // Node 더블 클릭시
    protected override doOpenNode(node: ExpandTypeNode): void {
        super.doOpenNode(node);

        // Xml파일인 경우
        if (node.id.includes('.xmodel')) {
            const filePath = this.labelProvider.getLongName(node);
            this.readModel.parseModel(filePath).then((xmlNodes: ParseNode[]) => {
                const readModelWidgets = this.widgetManager.getWidgets(ReadModelWidget.ID) as ReadModelWidget[];
                readModelWidgets.forEach(widget => {
                    widget.getReadTree(xmlNodes, 'readXml', node);
                });
            });

            if (!node.expanded) {
                this.expandNode(node);
            }
        }
    }

    override selectNode(node: Readonly<SelectableTreeNode>): void {
        super.selectNode(node);
        this.applicationShell.leftPanelHandler.toolBar.update();
    }
}

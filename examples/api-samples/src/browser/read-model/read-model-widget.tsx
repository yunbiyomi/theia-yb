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
import { codicon, CompositeTreeNode, ContextMenuRenderer, createTreeContainer, ExpandableTreeNode, LabelProvider, NodeProps, open, OpenerService, SelectableTreeNode, TreeImpl, TreeModel, TreeNode, TreeProps, TreeWidget, URIIconReference } from '@theia/core/lib/browser';
import { nodeType, ParseNode, parseType } from '../../common/read-model/read-model-service';
import { URI } from '@theia/core';
import { ReadModelTreeModel } from './read-model-tree-model';
import { TiUndoRedoService, TiUndoRedoStack } from './undo-redo/ti-undo-redo-service';
import { TiUndoRedoInfo, UNDO_REDO_ACTION, UNDO_REDO_AREA } from './undo-redo/ti-undo-redo-definition';

export interface TypeNode extends SelectableTreeNode, CompositeTreeNode {
    type: nodeType;
    index?: number;
}

export interface ExpandTypeNode extends TypeNode, ExpandableTreeNode {
}

@injectable()
export class ReadModelWidget extends TreeWidget {

    static readonly ID = 'read-model-widget';
    static readonly LABEL = 'Read Model';

    @inject(LabelProvider) protected override readonly labelProvider: LabelProvider;
    @inject(OpenerService) protected readonly openerService: OpenerService;

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

    createTypeNode(parseNode: ParseNode, icon: string, parent: ExpandTypeNode | CompositeTreeNode, type: nodeType, index?: number): TypeNode {
        return {
            id: parseNode.id,
            name: parseNode.id,
            icon,
            description: parseNode.filePath,
            parent,
            children: [],
            type,
            selected: false,
            index
        };
    }

    createExpandTypeNode(parseNode: ParseNode, icon: string, parent: ExpandTypeNode | TypeNode, type: nodeType, index?: number): ExpandTypeNode {
        return {
            id: parseNode.id,
            name: parseNode.id,
            icon,
            description: parseNode.filePath,
            parent,
            children: [],
            type,
            expanded: false,
            selected: false,
            index
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

    // 폴더 파싱한 결과를 바탕으로 Node 생성
    protected createTreeNode(parseNode: ParseNode, parent: ExpandTypeNode): TreeNode | undefined {
        const parseType: parseType = parseNode.parseType;

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

    // Node에 selected / focus 추가
    protected selectNodeHandle(selectedNode: SelectableTreeNode): void {
        this.model.selectNode(selectedNode);
        this.focusService.setFocus(selectedNode);
        this.node.focus();
    };

    // 가져온 FileNode를 바탕으로 Node 매달기
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
    async deleteNode(selectNode: TypeNode): Promise<void> {
        const parentsNode = selectNode.parent as CompositeTreeNode;
        CompositeTreeNode.removeChild(parentsNode, selectNode);
        this.createUndoRedoStack(selectNode, UNDO_REDO_ACTION.delete, UNDO_REDO_AREA.contentsEditor);

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

    // Node insert
    insertChild(parent: CompositeTreeNode, currentNode: TreeNode, child: TreeNode): CompositeTreeNode {
        const children = parent.children as TreeNode[];
        const currentIndex = CompositeTreeNode.indexOf(parent, currentNode);
        if (currentIndex !== -1) {
            children.splice(currentIndex, 0, child);
            CompositeTreeNode.setParent(child, currentIndex, parent);
        }
        return parent;
    }

    // 새로운 Node 추가
    async addNode(selectNode: ExpandTypeNode | TypeNode, type: string, value: string): Promise<void> {
        let root = selectNode;
        const path = this.labelProvider.getLongName(root);
        const newNodeinfo = { id: value, filePath: path } as ParseNode;
        const modelIcon = codicon('symbol-field');
        const nodeType = 'model';
        const fieldIcon = codicon('circle-small');
        const fieldType = 'field';
        const nodeIndex = selectNode?.index;
        let newAddNode: TypeNode | ExpandTypeNode;

        switch (type) {
            case 'folder':
                break;
            case 'file':
                newAddNode = this.createExpandTypeNode(newNodeinfo, modelIcon, root, nodeType);
                break;
            case 'model':
                newAddNode = this.createTypeNode(newNodeinfo, fieldIcon, root, fieldType, nodeIndex);
                break;
            case 'field':
                if (selectNode.parent) {
                    root = selectNode.parent as ExpandTypeNode;
                    if (root) {
                        newAddNode = this.createTypeNode(newNodeinfo, fieldIcon, root, fieldType, nodeIndex);
                    }
                }
                break;
            default:
                break;
        }

        if (newAddNode!) {
            if (type === 'field') {
                this.insertChild(root, selectNode, newAddNode);
            }
            else {
                CompositeTreeNode.addChild(root, newAddNode);
            }
            await this.model.refresh();
            this.selectNodeHandle(newAddNode);
            this.createUndoRedoStack(newAddNode, UNDO_REDO_ACTION.create, UNDO_REDO_AREA.contentsEditor);
        }

        // root가 접혀있을 때 node 추가시 expanded
        if (ExpandableTreeNode.is(root)) {
            if (!root.expanded) {
                this.model.expandNode(root);
            }

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

    async openCodeEditor(filePath: URI): Promise<void> {
        await open(this.openerService, filePath, undefined);
    }

    // UndoRedo
    undoRedoService = new TiUndoRedoService;
    undoRedoStack = new TiUndoRedoStack;

    createUndoRedoStack(node: TypeNode | ExpandTypeNode, action: UNDO_REDO_ACTION, area: UNDO_REDO_AREA): void {
        const newInfo: TiUndoRedoInfo = {
            action,
            area,
            extraInfo: node
        }

        this.undoRedoStack.push(newInfo);
        this.undoRedoService.pushStack(this.undoRedoStack);
    }

    async runUndo(): Promise<void> {
        if (!this.undoRedoService) {
            return;
        }

        const undoItem: TiUndoRedoStack | undefined = this.undoRedoService.undo();

        if (undoItem !== undefined) {
            const count = undoItem.count();
            for (let i = count - 1; i >= 0; i--) {
                this.doUndo(undoItem, i);
            }
        }
        // if (this.undoRedoService.isModified()) {
        //     const undoItem: 
        // } else {
        //     console.log('undo/redo 불가능');
        // }
    }

    async runRedo(): Promise<void> {
        if (!this.undoRedoService) {
            return;
        }

        const undoItem: TiUndoRedoStack | undefined = this.undoRedoService.undo();

        if (undoItem !== undefined) {
            const count = undoItem.count();
            for (let i = 0; i < count; i++) {
                this.doUndo(undoItem, i);
            }
        }

        // if (this.undoRedoService.isModified()) {
        //     this.undoRedoService.redo();
        // } else {
        //     console.log('undo/redo 불가능');
        // }
    }

    async doUndo(item: TiUndoRedoStack, index: number): Promise<void> {
        if (!item) {
            return;
        }

        const currentItem = item.getInfoData(index);
        const undoAction = currentItem.action;
        const undoNode = currentItem.extraInfo;

        switch (undoAction) {
            case 1:
                await this.deleteNode(undoNode);
                break;
            case 2:
                await this.addNode(undoNode, undoNode.type, undoNode.id);
                break;
            default:
                break;
        }

        console.log('doUndo success');
    }
}

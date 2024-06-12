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

import { Container, inject, injectable, interfaces, postConstruct } from '@theia/core/shared/inversify';
import { codicon, CompositeTreeNode, ContextMenuRenderer, createTreeContainer, ExpandableTreeNode, NodeProps, SelectableTreeNode, TreeImpl, TreeModel, TreeNode, TreeProps, TreeWidget } from '@theia/core/lib/browser';
import { NexaOptionsTreeModel } from './nexa-options-tree-model';
import React from 'react';

export interface OptionsNode extends SelectableTreeNode, CompositeTreeNode {

}

export interface ExpandOptionsNode extends OptionsNode, ExpandableTreeNode {

}

@injectable()
export class NexaOptionsTreeWidget extends TreeWidget {
    static readonly ID = 'nexa-options-tree-widget';
    static readonly LABEL = 'Nexa Options Tree Widget';

    static createContainer(parent: interfaces.Container): Container {
        const child = createTreeContainer(parent, {
            tree: TreeImpl,
            widget: NexaOptionsTreeWidget,
            model: NexaOptionsTreeModel
        });

        return child;
    }

    static createWidget(parent: interfaces.Container): NexaOptionsTreeWidget {
        return NexaOptionsTreeWidget.createContainer(parent).get(NexaOptionsTreeWidget);
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

        const root = this.createRootNode();


        const environmentRoot = this.createNodes('environment', 'Environment', codicon('globe'), root, true, 'environment-general', 'General');
        CompositeTreeNode.addChild(root, environmentRoot);
        const formDesignRoot = this.createNodes('form-design', 'FormDesign', codicon('symbol-color'), root, false, 'form-design-general', 'General');
        CompositeTreeNode.addChild(root, formDesignRoot);

        this.model.root = root;
        this.model.refresh(root);

        this.startFocus();

        this.update();
    }

    protected doInit(): void {
        this.id = NexaOptionsTreeWidget.ID;
        this.title.label = NexaOptionsTreeWidget.LABEL;
        this.title.caption = NexaOptionsTreeWidget.LABEL;
    }

    // 위젯 처음 렌더 시 environment-general select
    protected async startFocus(): Promise<void> {
        const root = this.model.root as CompositeTreeNode;
        const environmentTree = CompositeTreeNode.getFirstChild(root) as CompositeTreeNode;
        const environmentNode = CompositeTreeNode.getFirstChild(environmentTree) as SelectableTreeNode;
        this.model.selectNode(environmentNode);
        await this.model.refresh();
    }

    protected createRootNode(): ExpandOptionsNode {
        return {
            id: 'options-tree',
            name: 'Options',
            icon: codicon('settings-gear'),
            parent: undefined,
            visible: true,
            children: [],
            expanded: true,
            selected: false
        };
    }

    protected createExpandebleNode(id: string, name: string, icon: string, parent: CompositeTreeNode, expanded: boolean): ExpandOptionsNode {
        const newChildren: TreeNode[] = [];

        const node: ExpandOptionsNode = {
            id,
            name,
            icon,
            parent: parent,
            children: newChildren,
            expanded: expanded,
            selected: false
        }

        return node
    }

    protected createTreeNode(id: string, name: string, parent: CompositeTreeNode): OptionsNode {
        const newChildren: TreeNode[] = [];

        const node: OptionsNode = {
            id,
            name,
            icon: codicon('circle-small-filled'),
            parent: parent,
            children: newChildren,
            selected: false
        }

        return node
    }

    protected createNodes(id: string, name: string, icon: string, parent: CompositeTreeNode, exapnd: boolean, childId: string, childName: string): ExpandOptionsNode {
        const nodeChilds: TreeNode[] = [];
        const parentNode = this.createExpandebleNode(id, name, icon, parent, exapnd);

        const childNode = this.createTreeNode(childId, childName, parentNode);

        this.node.focus();
        nodeChilds.push(childNode);

        parentNode.children = nodeChilds;

        return parentNode
    }

    protected override renderIcon(node: TreeNode, props: NodeProps): React.ReactNode {
        if ((node as OptionsNode).icon) {
            return <span className={`${node.icon}`} style={{ marginRight: '5px' }} />;
        }
        return super.renderIcon(node, props);
    }

}


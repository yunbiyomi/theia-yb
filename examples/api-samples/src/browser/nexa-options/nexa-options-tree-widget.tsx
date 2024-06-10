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
import { CompositeTreeNode, ContextMenuRenderer, createTreeContainer, ExpandableTreeNode, TreeImpl, TreeModel, TreeModelImpl, TreeNode, TreeProps, TreeWidget } from '@theia/core/lib/browser';

@injectable()
export class NexaOptionsTreeWidget extends TreeWidget {
    static readonly ID = 'nexa-options-tree-widget';
    static readonly LABEL = 'Nexa Options Tree Widget';

    static createContainer(parent: interfaces.Container): Container {
        const child = createTreeContainer(parent, {
            tree: TreeImpl,
            widget: NexaOptionsTreeWidget,
            model: TreeModelImpl
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


        const environmentRoot = this.createNodes('environment', 'Environment', root, 'environment-general', 'General');
        CompositeTreeNode.addChild(root, environmentRoot);
        const formDesignRoot = this.createNodes('form-design', 'FormDesign', root, 'form-design-general', 'General');
        CompositeTreeNode.addChild(root, formDesignRoot);

        this.model.root = root;
        this.model.refresh(root);
        this.update();
    }

    protected doInit(): void {
        this.id = NexaOptionsTreeWidget.ID;
        this.title.label = NexaOptionsTreeWidget.LABEL;
        this.title.caption = NexaOptionsTreeWidget.LABEL;
        this.node.style.width = '50%';
        this.node.style.height = '100%';
    }

    protected createRootNode(): CompositeTreeNode {
        return {
            id: 'options-tree',
            name: 'Options',
            parent: undefined,
            visible: true,
            children: []
        };
    }

    protected createExpandebleNode(id: string, name: string, parent: CompositeTreeNode): ExpandableTreeNode {
        const newChildren: TreeNode[] = [];

        const node: ExpandableTreeNode = {
            id,
            name,
            parent: parent,
            children: newChildren,
            expanded: false
        }

        return node
    }

    protected createTreeNode(id: string, name: string, parent: CompositeTreeNode): TreeNode {
        const newChildren: TreeNode[] = [];

        const node: CompositeTreeNode = {
            id,
            name,
            parent: parent,
            children: newChildren
        }

        return node
    }

    protected createNodes(id: string, name: string, parent: CompositeTreeNode, childId: string, childName: string) {
        const nodeChilds: TreeNode[] = [];
        const parentNode = this.createExpandebleNode(id, name, parent);

        const childNode = this.createTreeNode(childId, childName, parentNode);
        nodeChilds.push(childNode);

        parentNode.children = nodeChilds;

        return parentNode
    }
}


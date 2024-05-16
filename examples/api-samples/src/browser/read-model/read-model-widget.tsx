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
import { CompositeTreeNode, ContextMenuRenderer, createTreeContainer, ExpandableTreeNode, LabelProvider, NodeProps, TreeImpl, TreeModel, TreeModelImpl, TreeNode, TreeProps, TreeWidget, URIIconReference } from '@theia/core/lib/browser';
import { FileNode, ReadModel } from '../../common/read-model/read-model-service';
import { URI } from '@theia/core';

export let filePath: string = '';

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

    protected createRootNode(): ExpandableTreeNode {
        return {
            id: 'model-tree',
            name: '_model_',
            parent: undefined,
            icon: 'codicon codicon-folder default-folder-icon',
            visible: true,
            expanded: false,
            children: []
        }
    }

    protected createTreeNode(fileNode: FileNode, parent: CompositeTreeNode): TreeNode {
        const newChildren: TreeNode[] = [];
        const nodePath: URI = new URI(fileNode.filePath);
        const nodeType: URIIconReference = fileNode.isDirectory ? URIIconReference.create('folder', nodePath) : URIIconReference.create('file', nodePath);

        const node: CompositeTreeNode = {
            id: fileNode.id,
            name: fileNode.id,
            icon: this.labelProvider.getIcon(nodeType),
            description: fileNode.filePath,
            parent: parent,
            children: newChildren
        }

        if (fileNode.children && Array.isArray(fileNode.children)) {
            const node: ExpandableTreeNode = {
                id: fileNode.id,
                name: fileNode.id,
                icon: this.labelProvider.getIcon(nodeType),
                description: fileNode.filePath,
                expanded: false,
                parent: parent,
                children: newChildren
            }

            for (const child of fileNode.children) {
                const childNode: TreeNode = this.createTreeNode(child, node);
                newChildren.push(childNode);
            }

            return node
        }

        return node
    }

    async getReadModel(fileNode: FileNode[]): Promise<void> {
        const root = this.createRootNode();

        fileNode.forEach((file: FileNode) => {
            const node = this.createTreeNode(file, root);
            CompositeTreeNode.addChild(root, node);
        });

        this.model.root = root;
        await this.model.refresh();
    }

    protected override renderIcon(node: TreeNode, props: NodeProps): React.ReactNode {
        const icon = this.toNodeIcon(node);
        if (icon) {
            return <div className={icon + ' file-icon'}></div>;
        }
        return null;
    }
}


@injectable()
export class ReadModelTreeModel extends TreeModelImpl {

    @inject(LabelProvider) protected readonly labelProvider: LabelProvider;
    @inject(ReadModel) protected readonly readModel: ReadModel;

    protected override doOpenNode(node: TreeNode): void {
        if (ExpandableTreeNode.is(node)) {
            this.toggleNodeExpansion(node);
        }
        else {
            filePath = this.labelProvider.getLongName(node);
            this.readModel.parseModel(filePath).then((message: string) => {
                this.readModel.getClient()?.printFileData(message);
            });
        }
    }
}

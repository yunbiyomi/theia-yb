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
import { CompositeTreeNode, ContextMenuRenderer, createTreeContainer, TreeImpl, TreeModel, TreeModelImpl, TreeProps, TreeWidget } from '@theia/core/lib/browser';


@injectable()
export class ReadModelWidget extends TreeWidget {

    static readonly ID = 'read-model-widget';
    static readonly LABEL = 'Read Model';

    static createContainer(parent: interfaces.Container): Container {
        const child = createTreeContainer(parent, {
            tree: TreeImpl,
            widget: ReadModelWidget,
            model: TreeModelImpl
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

        const root = this.createRootNode();

        CompositeTreeNode.addChild(root, {
            id: '1',
            name: 'view 1',
            parent: root
        });

        CompositeTreeNode.addChild(root, {
            id: '2',
            name: 'view 2',
            parent: root
        });

        CompositeTreeNode.addChild(root, {
            id: '3',
            name: 'view 3',
            parent: root
        });

        CompositeTreeNode.addChild(root, {
            id: '4',
            name: 'view 4',
            parent: root
        });

        this.model.root = root;
        this.model.refresh(root);
        this.update();
    }

    protected doInit(): void {
        this.id = ReadModelWidget.ID;
        this.title.label = ReadModelWidget.LABEL;
        this.title.caption = ReadModelWidget.LABEL;
        this.title.closable = true;
        this.title.iconClass = 'fa fa-tree';
    }

    protected createRootNode(): CompositeTreeNode {
        return {
            id: 'model-tree',
            name: '_model_',
            parent: undefined,
            visible: true,
            children: []
        }
    }
}

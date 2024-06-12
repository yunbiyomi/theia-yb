// *****************************************************************************
// Copyright (C) 2020 Ericsson and others.
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


import { BaseWidget, Message, MessageLoop, Panel, PanelLayout, WidgetManager } from '@theia/core/lib/browser';
import { inject, injectable, interfaces, postConstruct } from '@theia/core/shared/inversify';
import { NexaOptionsTreeWidget } from './tree/nexa-options-tree-widget';
import { NexaOptionsWidget } from './nexa-options-widget';

@injectable()
export class NexaOptionsMainWidget extends BaseWidget {
    static readonly ID = 'nexa-options-main-widget';
    static readonly LABEL = 'Nexa Options Main Widget';

    protected treePanel: Panel;

    @inject(WidgetManager) protected readonly widgetManager: WidgetManager;
    @inject(NexaOptionsTreeWidget) protected treeWidget: NexaOptionsTreeWidget;
    @inject(NexaOptionsWidget) public optionsWidget: NexaOptionsWidget;

    static createWidget(parent: interfaces.Container): NexaOptionsMainWidget {
        const child = NexaOptionsTreeWidget.createContainer(parent);
        child.bind(NexaOptionsMainWidget).toSelf().inSingletonScope();
        child.bind(NexaOptionsWidget).toSelf().inSingletonScope();
        return child.get(NexaOptionsMainWidget);
    }

    @postConstruct()
    protected init(): void {
        this.doInit();
    }

    protected async doInit(): Promise<void> {
        this.id = NexaOptionsMainWidget.ID;
        this.title.label = NexaOptionsMainWidget.LABEL;
        this.title.caption = NexaOptionsMainWidget.LABEL;
        this.title.closable = true;

        const layout = new PanelLayout();
        this.layout = layout;
        this.treePanel = new Panel({
            layout: new PanelLayout()
        });

        this.node.style.height = '100%';

        this.treeWidget.addClass('options-tree');
        this.treePanel.addWidget(this.treeWidget);
        this.optionsWidget.addClass('options-wiget');
        this.treePanel.addWidget(this.optionsWidget);
        this.toDispose.push(this.treePanel);

        this.treePanel.node.tabIndex = -1;
        this.treePanel.node.style.height = '100%';
        this.treePanel.node.style.display = 'flex';
        layout.addWidget(this.treePanel);
        this.update();

    }

    protected override onUpdateRequest(msg: Message): void {
        if (this.treePanel) {
            MessageLoop.sendMessage(this.treePanel, msg);
        }

        MessageLoop.sendMessage(this.treeWidget, msg);
        MessageLoop.sendMessage(this.optionsWidget, msg);
        super.onUpdateRequest(msg);
    }

}

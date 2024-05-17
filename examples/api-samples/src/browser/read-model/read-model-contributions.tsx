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

import { Command, CommandRegistry, MenuModelRegistry, MAIN_MENU_BAR } from '@theia/core';
import { injectable, inject, interfaces } from '@theia/core/shared/inversify';
import { AbstractViewContribution, bindViewContribution, codicon, FrontendApplicationContribution, Widget, WidgetFactory } from '@theia/core/lib/browser';
import { ReadModelClient, ReadModel, ReadModelPath, FileNode } from '../../common/read-model/read-model-service';
import { ReadModelWidget } from './read-model-widget';
import { ServiceConnectionProvider } from '@theia/core/lib/browser/messaging/service-connection-provider';
import { TabBarToolbarContribution, TabBarToolbarRegistry } from '@theia/core/lib/browser/shell/tab-bar-toolbar';

export const ReadModelCommand: Command = {
    id: ReadModelWidget.ID,
    label: ReadModelWidget.LABEL
};

export const NodeAddToolBarCommand: Command = {
    id: 'node-add-toolbar-command',
    iconClass: codicon('add')
}

export const NodeDeleteToolBarCommand: Command = {
    id: 'node-delete-toolbar-command',
    iconClass: codicon('chrome-minimize')
}

@injectable()
export class ReadModelFrontend implements ReadModelClient {
}

@injectable()
export class ReadModelContribution extends AbstractViewContribution<ReadModelWidget> implements TabBarToolbarContribution {

    @inject(CommandRegistry) protected readonly commandRegistry: CommandRegistry;
    @inject(ReadModel) protected readonly readModel: ReadModel
    @inject(ReadModelWidget) protected readonly readModelWidget: ReadModelWidget;

    constructor() {
        super({
            widgetId: ReadModelWidget.ID,
            widgetName: ReadModelWidget.LABEL,
            defaultWidgetOptions: { area: 'left' },
            toggleCommandId: ReadModelCommand.id
        });
    }

    // menu 생성
    override registerMenus(menus: MenuModelRegistry): void {
        const subMenuPath = [...MAIN_MENU_BAR, 'Read Model'];
        menus.registerSubmenu(subMenuPath, 'Read Model', {
            order: '99999'
        });

        menus.registerMenuAction(subMenuPath, {
            commandId: ReadModelCommand.id,
            order: '0'
        });
    }

    // command 생성
    override registerCommands(registry: CommandRegistry): void {
        // 트리 위젯 호출
        registry.registerCommand(ReadModelCommand, {
            execute: async () => {
                this.readModel.readModel().then((fileNode: FileNode[]) => {
                    super.openView({ activate: false, reveal: true });
                    this.readModelWidget.getReadModel(fileNode);
                });
            }
        });

        // Tabbar add command
        registry.registerCommand(NodeAddToolBarCommand, {
            execute: () => {
                console.log('Add 버튼입니다.');
            },
            isEnabled: widget => this.withWidget(widget, () => true),
            isVisible: widget => this.withWidget(widget, () => true),
        });

        // Tabbar delete command
        registry.registerCommand(NodeDeleteToolBarCommand, {
            execute: () => {
                const selectNode = this.readModelWidget.model.selectedNodes[0];
                this.readModelWidget.deleteNode(selectNode);
                this.readModel.deleteNode(selectNode).then((data: string) => {
                    console.log(data);
                })
            },
            isEnabled: widget => this.withWidget(widget, () => true),
            isVisible: widget => this.withWidget(widget, () => true),
        });
    }

    // Tabbar 설정
    async registerToolbarItems(registry: TabBarToolbarRegistry): Promise<void> {
        registry.registerItem({
            id: NodeAddToolBarCommand.id,
            command: NodeAddToolBarCommand.id,
            tooltip: 'Node Add',
            priority: 0
        });

        registry.registerItem({
            id: NodeDeleteToolBarCommand.id,
            command: NodeDeleteToolBarCommand.id,
            tooltip: 'Node Delete',
            priority: 1
        });
    }

    protected withWidget<T>(widget: Widget | undefined = this.tryGetWidget(), cb: (bulkEdit: ReadModelWidget) => T): T | false {
        if (widget instanceof ReadModelWidget) {
            return cb(widget);
        }
        return false;
    }
}

export const bindReadModelWidget = (bind: interfaces.Bind) => {
    bind(ReadModelClient).to(ReadModelFrontend).inSingletonScope();
    bind(ReadModel).toDynamicValue(ctx => {
        const connection = ctx.container.get(ServiceConnectionProvider);
        const client = ctx.container.get<ReadModelClient>(ReadModelClient);
        return connection.createProxy<ReadModel>(ReadModelPath, client);
    }).inSingletonScope();
    bindViewContribution(bind, ReadModelContribution);
    bind(TabBarToolbarContribution).toService(ReadModelContribution);
    bind(FrontendApplicationContribution).toService(ReadModelContribution);
    bind(ReadModelWidget).toDynamicValue(ctx => ReadModelWidget.createWidget(ctx.container)).inSingletonScope();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: ReadModelWidget.ID,
        createWidget: () => ctx.container.get<ReadModelWidget>(ReadModelWidget)
    })).inSingletonScope();
}

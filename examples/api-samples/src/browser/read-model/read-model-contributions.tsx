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
import { AbstractViewContribution, bindViewContribution, FrontendApplicationContribution, WidgetFactory } from '@theia/core/lib/browser';
import { ReadModelClient, FileNode, ReadModel, ReadModelPath } from '../../common/read-model/read-model-service';
import { ReadModelWidget } from './read-model-widget';
import { ServiceConnectionProvider } from '@theia/core/lib/browser/messaging/service-connection-provider';

export const ReadModelCommand: Command = {
    id: ReadModelWidget.ID,
    label: ReadModelWidget.LABEL
};

@injectable()
export class ReadModelFrontend implements ReadModelClient {
    public printOutputChannelManager(fileNode: FileNode[]): void {
        fileNode.forEach((node: FileNode) => {
            console.log(`${JSON.stringify(node)}`);
        });
    }
}

@injectable()
export class ReadModelContribution extends AbstractViewContribution<ReadModelWidget> {

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

    override registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(ReadModelCommand, {
            execute: async () => {
                this.readModel.readModel().then((fileNode: FileNode[]) => {
                    super.openView({ activate: false, reveal: true });
                    this.readModel.getClient()?.printOutputChannelManager(fileNode);
                });
            }
        });
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
    bind(FrontendApplicationContribution).toService(ReadModelContribution);
    bind(ReadModelWidget).toDynamicValue(ctx => ReadModelWidget.createWidget(ctx.container));
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: ReadModelWidget.ID,
        createWidget: () => ctx.container.get<ReadModelWidget>(ReadModelWidget)
    })).inSingletonScope();
}

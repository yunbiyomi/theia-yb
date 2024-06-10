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

import { Command, CommandContribution, CommandRegistry, MAIN_MENU_BAR, MenuContribution, MenuModelRegistry } from '@theia/core';
import { inject, injectable, interfaces } from '@theia/core/shared/inversify';
import { LocalConnectionProvider, ServiceConnectionProvider } from '@theia/core/lib/browser/messaging/service-connection-provider';
import { NexaOptions, NexaOptionsClient, NexaOptionsPath, OptionsData } from '../../common/nexa-options/nexa-options-sevice';
import { WidgetFactory, WidgetManager } from '@theia/core/lib/browser';
import { NexaOptionsDialog } from './nexa-options-dialog';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { FileDialogService } from '@theia/filesystem/lib/browser';
import { NexaOptionsTreeWidget } from './nexa-options-tree-widget';

const OptionsCommand: Command = {
    id: 'nexa-options',
    label: 'Nexa Options'
};

@injectable()
export class NexaOptionsClientContribution implements NexaOptionsClient {
}

@injectable()
export class NexaOptionsContribution implements CommandContribution, MenuContribution {

    @inject(NexaOptions) protected readonly options: NexaOptions;
    @inject(WidgetManager) protected readonly widgetManager: WidgetManager;
    @inject(CommandRegistry) protected readonly commandRegistry: CommandRegistry;
    @inject(WorkspaceService) protected readonly workspaceService: WorkspaceService;
    @inject(FileDialogService) protected readonly fileDialogService: FileDialogService;

    optionsData: OptionsData;

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(OptionsCommand, {
            execute: async () => {
                this.options.readOptionsFile().then((data: OptionsData) => {
                    this.optionsData = data;
                    this.showDialog();
                });
            }
        });
    }

    private showDialog(): void {
        const dialog = new NexaOptionsDialog(this.commandRegistry, this.widgetManager, this.options, this.workspaceService, this.fileDialogService, this.optionsData);
        dialog.open();
    }

    registerMenus(menus: MenuModelRegistry): void {
        const subMenuPath = [...MAIN_MENU_BAR, 'Options'];
        menus.registerSubmenu(subMenuPath, 'Options', {
            order: '9999999'
        });
        menus.registerMenuAction(subMenuPath, {
            commandId: OptionsCommand.id,
            order: '0'
        });
    };
}

export const bindOptions = (bind: interfaces.Bind) => {
    bind(NexaOptionsClient).to(NexaOptionsClientContribution).inSingletonScope();
    bind(NexaOptions).toDynamicValue(ctx => {
        const connection = ctx.container.get<ServiceConnectionProvider>(LocalConnectionProvider);
        const client = ctx.container.get<NexaOptionsClient>(NexaOptionsClient);
        return connection.createProxy<NexaOptions>(NexaOptionsPath, client);
    }).inSingletonScope();
    bind(CommandContribution).to(NexaOptionsContribution).inSingletonScope();
    bind(MenuContribution).to(NexaOptionsContribution).inSingletonScope();
    bind(NexaOptionsTreeWidget).toSelf().inSingletonScope();
    bind(NexaOptionsDialog).toSelf().inSingletonScope();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: NexaOptionsTreeWidget.ID,
        createWidget: () => ctx.container.get<NexaOptionsTreeWidget>(NexaOptionsTreeWidget)
    })).inSingletonScope();
};

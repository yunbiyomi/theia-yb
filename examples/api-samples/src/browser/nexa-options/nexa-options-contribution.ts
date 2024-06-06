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
import { OutputChannelManager } from '@theia/output/lib/browser/output-channel';
import { NexaOptions, NexaOptionsClient, NexaOptionsPath } from '../../common/nexa-options/nexa-options-sevice';
import { DialogProps } from '@theia/core/lib/browser';
import { NexaOptionsDialog } from './nexa-options-dialog';

const OptionsCommand: Command = {
    id: 'nexa-options',
    label: 'Nexa Options'
};

@injectable()
export class NexaOptionsClientContribution implements NexaOptionsClient {

    @inject(OutputChannelManager) protected readonly outputChannelManager: OutputChannelManager;

    public printOutputChannelManager(message: string): void {
        const channel = this.outputChannelManager.getChannel('Print Output');
        channel.appendLine('Hello world!');
        channel.appendLine(message);
        channel.show();
    }
}

@injectable()
export class NexaOptionsContribution implements CommandContribution, MenuContribution {

    @inject(DialogProps)
    protected readonly dialogProps: DialogProps;

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(OptionsCommand, {
            execute: async () => this.showDialog()
        });
    }

    private showDialog(): void {
        const dialog = new NexaOptionsDialog(this.dialogProps);
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
    bind(CommandContribution).to(NexaOptionsContribution);
    bind(MenuContribution).to(NexaOptionsContribution);
    bind(DialogProps).toSelf().inSingletonScope();
    bind(NexaOptionsDialog).toSelf();
};

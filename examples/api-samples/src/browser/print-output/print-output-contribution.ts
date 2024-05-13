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

import { Command, CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MAIN_MENU_BAR } from '@theia/core';
import { injectable, inject, interfaces } from '@theia/core/shared/inversify';
import { PrintOutput, PrintOutputClient, PrintOutputPath } from '../../common/print-output/print-output-service';
import { OutputChannelManager } from '@theia/output/lib/browser/output-channel';
import { ServiceConnectionProvider } from '@theia/core/lib/browser/messaging/service-connection-provider';

const PrintOutputCommand: Command = {
    id: 'print-output',
    label: 'Print Output'
};

@injectable()
export class PrintOutputContribution implements PrintOutputClient {

    @inject(OutputChannelManager)
    protected readonly outputChannelManager: OutputChannelManager;

    public printOutputChannelManager(message: string): void {
        const channel = this.outputChannelManager.getChannel('Print Output');
        channel.appendLine('Hello world!');
        channel.appendLine(message);
        channel.show();
    }
}

@injectable()
export class PrintOutputCommandContribution implements CommandContribution {

    constructor(
        @inject(PrintOutput)
        protected readonly printOutput: PrintOutput,
    ) { }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(PrintOutputCommand, {
            execute: async () => {
                this.printOutput.getCallBack().then((message: string) => {
                    this.printOutput.getClient()?.printOutputChannelManager(message);
                });
            }
        });
    }
}

@injectable()
export class PrintOutputMenuContribution implements MenuContribution {
    registerMenus(menus: MenuModelRegistry): void {
        const subMenuPath = [...MAIN_MENU_BAR, 'Print Output'];
        menus.registerSubmenu(subMenuPath, 'Print Output', {
            order: '99999'
        });
        menus.registerMenuAction(subMenuPath, {
            commandId: PrintOutputCommand.id,
            order: '0'
        });
    };
}

export const bindPrintOutput = (bind: interfaces.Bind) => {
    bind(CommandContribution).to(PrintOutputCommandContribution).inSingletonScope();
    bind(MenuContribution).to(PrintOutputMenuContribution).inSingletonScope();
    bind(PrintOutputClient).to(PrintOutputContribution).inSingletonScope();
    bind(PrintOutput).toDynamicValue(ctx => {
        const connection = ctx.container.get(ServiceConnectionProvider);
        const client = ctx.container.get<PrintOutputClient>(PrintOutputClient);
        return connection.createProxy<PrintOutput>(PrintOutputPath, client);
    }).inSingletonScope();
}

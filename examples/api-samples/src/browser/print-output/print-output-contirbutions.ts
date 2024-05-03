// *****************************************************************************
// Copyright (C) 2020 TORO Limited and others.
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
import { inject, injectable } from '@theia/core/shared/inversify';
import { OutputChannelManager } from '@theia/output/src/browser/output-channel';
import { PrintOutputClient, PrintOutputServer } from '../../common/print-output-server';

const PrintOutputCommand: Command = {
    id: 'print-output-command',
    label: 'Print Output Command'
};

@injectable()
export class PrintOutputContribution implements PrintOutputClient {
    @inject(OutputChannelManager)
    protected readonly outputChannelManager: OutputChannelManager;

    public printOutputChannelManager(str: string): void {
        const channel = this.outputChannelManager.getChannel('Frontend Show');
        channel.append('Hello world!');
        channel.show();
    }
}

@injectable()
export class PrintOutputCommandContribution implements CommandContribution {

    constructor(
        @inject(PrintOutputServer)
        protected readonly printOutputServer: PrintOutputServer,
    ) { }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(PrintOutputCommand, {
            execute: async () => {
                this.printOutputServer.getCallBackend().then((message: string) => {
                    this.printOutputServer.getClient()?.printOutputChannelManager(message);
                });
            }
        });
    }
}

@injectable()
export class PrintOutputMenuContribution implements MenuContribution {
    registerMenus(menus: MenuModelRegistry): void {
        const subMenuPath = [...MAIN_MENU_BAR, 'Backend Connect Test'];
        menus.registerSubmenu(subMenuPath, 'Backend Connect Test', {
            order: '99999'
        });
        menus.registerMenuAction(subMenuPath, {
            commandId: PrintOutputCommand.id,
            order: '0'
        });
    };
}

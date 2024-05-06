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
import { injectable, inject } from '@theia/core/shared/inversify';
import { BackendLogger, BackendLoggerClient } from '../../common/backend-connect/backend-connect-service';
import { OutputChannelManager } from '@theia/output/lib/browser/output-channel';

const BackendConnect: Command = {
    id: 'backend-test',
    label: 'Backend Test'
};

@injectable()
export class BackendLoggerClientContribution implements BackendLoggerClient {

    @inject(OutputChannelManager)
    protected readonly outputChannelManager: OutputChannelManager;

    public callOutputChannelManager(str: string): void {
        const channel = this.outputChannelManager.getChannel('Backend-Test');
        channel.appendLine('Connected with Backend!');
        channel.appendLine(str);
        channel.show();
    }
}

@injectable()
export class BackendConnectCommandContribution implements CommandContribution {

    constructor(
        @inject(BackendLogger)
        protected readonly backendLogger: BackendLogger,
    ) { }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(BackendConnect, {
            execute: async () => {
                this.backendLogger.connectBackend().then((str: string) => {
                    this.backendLogger.getClient()?.callOutputChannelManager(str);
                });
            }
        });
    }
}

@injectable()
export class BackendConnectMenuContribution implements MenuContribution {
    registerMenus(menus: MenuModelRegistry): void {
        const subMenuPath = [...MAIN_MENU_BAR, 'Backend Connect Test'];
        menus.registerSubmenu(subMenuPath, 'Backend Connect Test', {
            order: '99999'
        });
        menus.registerMenuAction(subMenuPath, {
            commandId: BackendConnect.id,
            order: '0'
        });
    };
}

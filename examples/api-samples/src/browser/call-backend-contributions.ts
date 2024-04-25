// *****************************************************************************
// Copyright (C) 2023 Ericsson and others.
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
import { injectable, inject } from '@theia/core/shared/inversify';
import { Command, CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry } from '@theia/core/lib/common';
import { CommonMenus } from '@theia/core/lib/browser';
import { CallBackend } from '../common/call-backend';

export const CallBackendCommand: Command = {
    id: 'CallBackend.command',
    label: 'Call Backend'
};

@injectable()
export class CallBackendCommandContribution implements CommandContribution {

    constructor(
        @inject(CallBackend) private readonly callBackService: CallBackend
    ) { }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(CallBackendCommand, {
            execute: async () => {
                this.callBackService.getCallBackend().then(callString => alert(callString))
            }
        });
    }
}

@injectable()
export class CallBackendMenuContribution implements MenuContribution {

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(CommonMenus.EDIT_FIND, {
            commandId: CallBackendCommand.id,
            label: CallBackendCommand.label
        });
    }
}

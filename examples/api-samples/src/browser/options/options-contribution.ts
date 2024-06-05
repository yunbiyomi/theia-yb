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
import { injectable, interfaces } from '@theia/core/shared/inversify';
// import { OptionsDialog } from './options-dialog';

const OptionsCommand: Command = {
    id: 'options',
    label: 'Options'
};

@injectable()
export class OptionsCommandContribution implements CommandContribution {

    // @inject(AboutDialog) protected readonly aboutDialog: AboutDialog
    // @inject(OptionsDialog) protected readonly optionsDialog: OptionsDialog

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(OptionsCommand, {
            execute: async () => {

            }
        });
    }

    // protected async openOptions(): Promise<void> {
    //     this.optionsDialog.open();
    // }

}

@injectable()
export class OptionsMenuContribution implements MenuContribution {
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
    bind(CommandContribution).to(OptionsCommandContribution).inSingletonScope();
    bind(MenuContribution).to(OptionsMenuContribution).inSingletonScope();
}

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

import { Command, CommandRegistry, MAIN_MENU_BAR, MenuModelRegistry } from '@theia/core';
import { inject, injectable, interfaces } from '@theia/core/shared/inversify';
import { NexaOptions, NexaOptionsClient, NexaOptionsPath } from '../../common/nexa-options/nexa-options-sevice';
import { AbstractViewContribution, bindViewContribution, FrontendApplicationContribution, WidgetFactory } from '@theia/core/lib/browser';
import { NexaOptionsMainWidget } from './nexa-options-main-widget';
import { LocalConnectionProvider, ServiceConnectionProvider } from '@theia/core/lib/browser/messaging/service-connection-provider';

const OptionsCommand: Command = {
    id: 'nexa-options',
    label: 'Nexa Options'
};

@injectable()
export class NexaOptionsClientContribution implements NexaOptionsClient {

}

@injectable()
export class NexaOptionsContribution extends AbstractViewContribution<NexaOptionsMainWidget> {

    @inject(NexaOptions) protected readonly nexaOptions: NexaOptions;

    constructor() {
        super({
            widgetId: NexaOptionsMainWidget.ID,
            widgetName: NexaOptionsMainWidget.LABEL,
            defaultWidgetOptions: {
                area: 'main',
            }
        });
    }

    override registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(OptionsCommand, {
            execute: async () => {
                const mainWidget = await this.openView({ reveal: true });
                mainWidget.optionsWidget.setOptionsData();
                this.shell.activateWidget(this.viewId);
            }
        });
    }

    override registerMenus(menus: MenuModelRegistry): void {
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

export const bindOptionsMain = (bind: interfaces.Bind) => {
    bind(NexaOptionsClient).to(NexaOptionsClientContribution).inSingletonScope();
    bind(NexaOptions).toDynamicValue(ctx => {
        const connection = ctx.container.get<ServiceConnectionProvider>(LocalConnectionProvider);
        const client = ctx.container.get<NexaOptionsClient>(NexaOptionsClient);
        return connection.createProxy<NexaOptions>(NexaOptionsPath, client);
    }).inSingletonScope();
    bindViewContribution(bind, NexaOptionsContribution);
    bind(FrontendApplicationContribution).toService(NexaOptionsContribution);
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: NexaOptionsMainWidget.ID,
        createWidget: () => NexaOptionsMainWidget.createWidget(ctx.container)
    })).inSingletonScope();
};

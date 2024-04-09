// *****************************************************************************
// Copyright (C) 2018 Ericsson and others.
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

import { inject, injectable, interfaces } from '@theia/core/shared/inversify';
import { OpenStartWidget } from './open-start-widget';
import {
    AbstractViewContribution,
    CommonMenus,
    FrontendApplication,
    FrontendApplicationContribution,
    WidgetFactory,
    bindViewContribution
} from '@theia/core/lib/browser';
import { FrontendApplicationStateService } from '@theia/core/lib/browser/frontend-application-state';
import { CommandRegistry, MenuModelRegistry } from '@theia/core';
import { GettingStartedWidget } from './../../../../../packages/getting-started/lib/browser/getting-started-widget';

export const OpenStartCommand = {
    id: OpenStartWidget.ID,
    label: OpenStartWidget.LABEL
};

@injectable()
export class OpenStartContribution extends AbstractViewContribution<OpenStartWidget> implements FrontendApplicationContribution {
    @inject(FrontendApplicationStateService)
    protected readonly stateService: FrontendApplicationStateService;

    @inject(CommandRegistry)
    protected readonly commandRegistry: CommandRegistry;

    constructor() {
        super({
            widgetId: OpenStartWidget.ID,
            widgetName: OpenStartWidget.LABEL,
            defaultWidgetOptions: {
                area: 'main',
            }
        });
    }

    async onStart(app: FrontendApplication): Promise<void> {
        this.stateService.reachedState('ready').then(async () => {
            this.openView({ reveal: true, activate: true });
        });
    }

    override registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(CommonMenus.HELP, {
            commandId: OpenStartCommand.id,
            label: OpenStartCommand.label,
            order: 'a10'
        });
    }

    override registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(OpenStartCommand, {
            execute: () => this.openView({ reveal: true, activate: true }),
        });
    }
}

export const bindOpenStartWidget = (bind: interfaces.Bind, unbind: interfaces.Unbind, rebind: interfaces.Rebind) => {
    bindViewContribution(bind, OpenStartContribution);
    bind(FrontendApplicationContribution).toService(OpenStartContribution);
    bind(OpenStartWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(context => ({
        id: OpenStartWidget.ID,
        createWidget: () => context.container.get<OpenStartWidget>(OpenStartWidget)
    })).inSingletonScope();
    unbind(GettingStartedWidget);
};

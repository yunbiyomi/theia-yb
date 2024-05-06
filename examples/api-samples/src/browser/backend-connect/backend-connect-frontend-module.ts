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

import { CommandContribution, MenuContribution } from '@theia/core';
import { ContainerModule } from '@theia/core/shared/inversify';
import { BackendLogger, BackendLoggerClient, BackendLoggerServicePath } from '../../common/backend-connect/backend-connect-service';
import { BackendConnectCommandContribution, BackendConnectMenuContribution, BackendLoggerClientContribution } from './backend-connect-contribution';
import { ServiceConnectionProvider } from '@theia/core/lib/browser/messaging/service-connection-provider';

export default new ContainerModule(bind => {
    bind(CommandContribution).to(BackendConnectCommandContribution).inSingletonScope();
    bind(MenuContribution).to(BackendConnectMenuContribution).inSingletonScope();
    bind(BackendLoggerClient).to(BackendLoggerClientContribution).inSingletonScope();
    bind(BackendLogger).toDynamicValue(ctx => {
        const connection = ctx.container.get(ServiceConnectionProvider);
        const client = ctx.container.get<BackendLoggerClient>(BackendLoggerClient);
        return connection.createProxy<BackendLogger>(BackendLoggerServicePath, client);
    }).inSingletonScope();
});

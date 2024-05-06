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

import { ConnectionHandler, RpcConnectionHandler } from '@theia/core';
import { ContainerModule } from '@theia/core/shared/inversify';
import { BackendLogger, BackendLoggerClient, BackendLoggerServicePath } from '../../common/backend-connect/backend-connect-service';
import { BackendConnectLogger } from './backend-connect-impl';

export default new ContainerModule(bind => {
    bind(BackendLogger).to(BackendConnectLogger).inSingletonScope();
    bind(ConnectionHandler).toDynamicValue(ctx =>
        new RpcConnectionHandler<BackendLoggerClient>(BackendLoggerServicePath, client => {
            const backendLogger = ctx.container.get<BackendLogger>(BackendLogger);
            backendLogger.setClient(client);
            return backendLogger;
        })
    ).inSingletonScope();
});

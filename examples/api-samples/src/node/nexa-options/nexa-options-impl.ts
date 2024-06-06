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
import { injectable, interfaces } from '@theia/core/shared/inversify';
import { NexaOptions, NexaOptionsClient, NexaOptionsPath } from '../../common/nexa-options/nexa-options-sevice';

@injectable()
export class NexaOptionsImpl implements NexaOptions {
    protected client: NexaOptionsClient | undefined;

    getClient(): NexaOptionsClient | undefined {
        if (this.client !== undefined) { return this.client; }
    }

    setClient(client: NexaOptionsClient): void {
        this.client = client;
    }

    dispose(): void {
        throw new Error('Method not implemented.');
    }
}

export const bindPrintOutputBackend = (bind: interfaces.Bind) => {
    bind(NexaOptions).to(NexaOptionsImpl).inSingletonScope();
    bind(ConnectionHandler).toDynamicValue(ctx =>
        new RpcConnectionHandler<NexaOptionsClient>(NexaOptionsPath, client => {
            const server = ctx.container.get<NexaOptions>(NexaOptions);
            server.setClient(client);
            return server;
        })
    ).inSingletonScope();
};

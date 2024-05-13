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
import { PrintOutput, PrintOutputClient, PrintOutputPath } from '../../common/print-output/print-output-service';

@injectable()
export class PrintOutputImpl implements PrintOutput {
    protected client: PrintOutputClient | undefined;

    getClient(): PrintOutputClient | undefined {
        if (this.client !== undefined) { return this.client; }
    }

    setClient(client: PrintOutputClient): void {
        this.client = client;
    }

    dispose(): void {
        throw new Error('Method not implemented.');
    }

    getCallBack(): Promise<string> {
        return Promise.resolve('callback Backend!!');
    }
}

export const bindPrintOutputBackend = (bind: interfaces.Bind) => {
    bind(PrintOutput).to(PrintOutputImpl).inSingletonScope();
    bind(ConnectionHandler).toDynamicValue(ctx =>
        new RpcConnectionHandler<PrintOutputClient>(PrintOutputPath, client => {
            const server = ctx.container.get<PrintOutput>(PrintOutput);
            server.setClient(client);
            return server;
        })
    ).inSingletonScope();
}

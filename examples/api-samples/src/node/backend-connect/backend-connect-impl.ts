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

import { injectable } from '@theia/core/shared/inversify';
import { BackendLogger, BackendLoggerClient } from '../../common/backend-connect/backend-connect-service';

@injectable()
export class BackendConnectLogger implements BackendLogger {
    protected client: BackendLoggerClient | undefined;

    getClient(): BackendLoggerClient | undefined {
        if (this.client !== undefined) { return this.client; }
    }

    setClient(client: BackendLoggerClient): void {
        this.client = client;
    }

    dispose(): void {
        throw new Error('Method not implemented.');
    }

    connectBackend(): Promise<string> {
        const timestamp = new Date().toUTCString();
        console.log(`[${timestamp}] Connect with Backend!`);
        return Promise.resolve(`[${timestamp}] Hello from backend!`);
    }
}

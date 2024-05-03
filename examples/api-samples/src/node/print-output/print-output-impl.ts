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

import { injectable } from '@theia/core/shared/inversify';
import { PrintOutputClient, PrintOutputServer } from '../../common/print-output-server';

@injectable()
export class PrintOutputImpl implements PrintOutputServer {
    dispose(): void {
        throw new Error('Method not implemented.');
    }

    protected client: PrintOutputClient | undefined;

    setClient(client: PrintOutputClient | undefined): void {
        this.client = client;
    }

    getClient?(): PrintOutputClient | undefined {
        if (this.client !== undefined)
            return this.client;
    }

    getCallBackend(): Promise<string> {
        return Promise.resolve("call Backend!!");
    }
}

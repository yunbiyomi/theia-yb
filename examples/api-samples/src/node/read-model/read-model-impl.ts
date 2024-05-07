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
import { ReadModel, ReadModelClient } from '../../common/read-model/read-model-service';

@injectable()
export class ReadModelImpl implements ReadModel {
    protected client: ReadModelClient | undefined;

    getClient(): ReadModelClient | undefined {
        if (this.client !== undefined) { return this.client; }
    }

    setClient(client: ReadModelClient): void {
        this.client = client;
    }

    dispose(): void {
        throw new Error('Method not implemented.');
    }

    getCallBack(): Promise<string> {
        return Promise.resolve('read Model');
    }
}

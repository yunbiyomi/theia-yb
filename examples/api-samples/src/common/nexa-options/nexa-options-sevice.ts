/* eslint-disable @theia/runtime-import-check */
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

import { RpcServer } from '@theia/core/lib/common/messaging/proxy-factory';
import { OptionsData } from '../../browser/nexa-options/nexa-options-definitions';

export const NexaOptionsPath = '/services/nexaOptions';
export const NexaOptions = Symbol('NexaOptions');

export interface NexaOptions extends RpcServer<NexaOptionsClient> {
    setClient(client: NexaOptionsClient | undefined): void;
    getClient(): NexaOptionsClient | undefined;
    parseOptionsFile(): Promise<OptionsData>;
    readOptionsFile(): Promise<{ result?: boolean; data?: OptionsData }>;
    saveOptionsFile(data: OptionsData): Promise<boolean>;
    resetOptionsFile(type: string): Promise<boolean>;
}

export const NexaOptionsClient = Symbol('NexaOptions');
export interface NexaOptionsClient {
}

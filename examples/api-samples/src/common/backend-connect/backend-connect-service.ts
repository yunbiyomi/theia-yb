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

export const BackendLoggerServicePath = '/services/backendLogger';
export const BackendLogger = Symbol('BackendLogger');
export interface BackendLogger extends RpcServer<BackendLoggerClient> {
    setClient(client: BackendLoggerClient | undefined): void;
    getClient(): BackendLoggerClient | undefined;
    connectBackend(): Promise<string>
}

export const BackendLoggerClient = Symbol('BackendLoggerClient');
export interface BackendLoggerClient {
    callOutputChannelManager(str: string): void;
}

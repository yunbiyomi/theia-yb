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
import { ServiceConnectionProvider } from '@theia/core/lib/browser/messaging/service-connection-provider';
import { ReadModelCommandContribution, ReadModelContribution, ReadModelMenuContribution } from './read-model-contributions';
import { ReadModel, ReadModelClient, ReadModelPath } from '../../common/read-model/read-model-service';

export default new ContainerModule(bind => {
    bind(CommandContribution).to(ReadModelCommandContribution).inSingletonScope();
    bind(MenuContribution).to(ReadModelMenuContribution).inSingletonScope();
    bind(ReadModelClient).to(ReadModelContribution).inSingletonScope();
    bind(ReadModel).toDynamicValue(ctx => {
        const connection = ctx.container.get(ServiceConnectionProvider);
        const client = ctx.container.get<ReadModelClient>(ReadModelClient);
        return connection.createProxy<ReadModel>(ReadModelPath, client);
    }).inSingletonScope();
});

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
import { PrintOutput, PrintOutputClient, PrintOutputPath } from '../../common/print-output/print-output-service';
import { PrintOutputCommandContribution, PrintOutputContribution, PrintOutputMenuContribution } from './print-output-contribution';
import { ServiceConnectionProvider } from '@theia/core/lib/browser/messaging/service-connection-provider';

export default new ContainerModule(bind => {
    bind(CommandContribution).to(PrintOutputCommandContribution).inSingletonScope();
    bind(MenuContribution).to(PrintOutputMenuContribution).inSingletonScope();
    bind(PrintOutputClient).to(PrintOutputContribution).inSingletonScope();
    bind(PrintOutput).toDynamicValue(ctx => {
        const connection = ctx.container.get(ServiceConnectionProvider);
        const client = ctx.container.get<PrintOutputClient>(PrintOutputClient);
        return connection.createProxy<PrintOutput>(PrintOutputPath, client);
    }).inSingletonScope();
});

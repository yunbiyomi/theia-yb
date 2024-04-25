// *****************************************************************************
// Copyright (C) 2019 Arm and others.
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

import { ContainerModule, interfaces } from '@theia/core/shared/inversify';
import { bindDynamicLabelProvider } from './label/sample-dynamic-label-provider-command-contribution';
import { bindSampleFilteredCommandContribution } from './contribution-filter/sample-filtered-command-contribution';
import { bindSampleUnclosableView } from './view/sample-unclosable-view-contribution';
import { bindSampleOutputChannelWithSeverity } from './output/sample-output-channel-with-severity';
import { bindSampleMenu } from './menu/sample-menu-contribution';
import { bindSampleFileWatching } from './file-watching/sample-file-watching-contribution';
import { bindVSXCommand } from './vsx/sample-vsx-command-contribution';
import { bindSampleToolbarContribution } from './toolbar/sample-toolbar-contribution';

import '../../src/browser/style/branding.css';
import '../../src/browser/style/open-start-widget.css';
import { bindMonacoPreferenceExtractor } from './monaco-editor-preferences/monaco-editor-preference-extractor';
import { rebindOVSXClientFactory } from '../common/vsx/sample-ovsx-client-factory';
import { bindSampleAppInfo } from './vsx/sample-frontend-app-info';
import { bindTestSample } from './test/sample-test-contribution';
import { bindSampleFileSystemCapabilitiesCommands } from './file-system/sample-file-system-capabilities';
import { bindOpenStartWidget } from './open-start/open-start-contribution';
import { CallBackend, CallBackendConstants } from '../common/call-backend';
import { WebSocketConnectionProvider } from '@theia/core/lib/browser';

export default new ContainerModule((
    bind: interfaces.Bind,
    unbind: interfaces.Unbind,
    isBound: interfaces.IsBound,
    rebind: interfaces.Rebind,
) => {
    bindDynamicLabelProvider(bind);
    bindSampleUnclosableView(bind);
    bindSampleOutputChannelWithSeverity(bind);
    bindSampleMenu(bind);
    bindSampleFileWatching(bind);
    bindVSXCommand(bind);
    bindSampleFilteredCommandContribution(bind);
    bindSampleToolbarContribution(bind, rebind);
    bindMonacoPreferenceExtractor(bind);
    bindSampleAppInfo(bind);
    bindTestSample(bind);
    bindSampleFileSystemCapabilitiesCommands(bind);
    rebindOVSXClientFactory(rebind);
    bindOpenStartWidget(bind, unbind, rebind);
    bind(CallBackend).toDynamicValue(ctx => {
        const connection = ctx.container.get(WebSocketConnectionProvider);
        return connection.createProxy<CallBackend>(CallBackendConstants.SERVICE_PATH);
    }).inSingletonScope();
});

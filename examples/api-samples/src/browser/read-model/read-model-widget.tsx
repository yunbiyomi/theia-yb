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

import * as React from '@theia/core/shared/react';
import { injectable, postConstruct } from '@theia/core/shared/inversify';
import { ReactWidget } from '@theia/core/lib/browser';

@injectable()
export class ReadModelWidget extends ReactWidget {
    static readonly ID = 'read-model-widget';
    static readonly LABEL = 'Read Model';

    @postConstruct()
    protected init(): void {
        this.doInit();
    }

    protected async doInit(): Promise<void> {
        this.id = ReadModelWidget.ID;
        this.title.label = ReadModelWidget.LABEL;
        this.title.caption = ReadModelWidget.LABEL;
        this.title.closable = true;
        this.title.iconClass = 'fa fa-tree';
        this.update();
    }

    protected render(): React.JSX.Element {
        return <>
            <div id='widget-container'>
                Hello Read Model Widget!
            </div>
        </>
    }
}

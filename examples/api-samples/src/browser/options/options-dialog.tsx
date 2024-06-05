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

import React from 'react';
import { inject, injectable, postConstruct } from '@theia/core/shared/inversify';
import { DialogProps } from '@theia/core/lib/browser';
import { ReactDialog } from '@theia/core/lib/browser/dialogs/react-dialog';

@injectable()
export class OptionsDialogProps extends DialogProps {
}

@injectable()
export class OptionsDialog extends ReactDialog<void> {
    get value(): void {
        throw new Error('Method not implemented.');
    }

    constructor(
        @inject(OptionsDialogProps) protected override readonly props: OptionsDialogProps
    ) {
        super({
            title: 'Options',
        });
    }

    @postConstruct()
    protected init(): void {
        this.doInit();
    }

    protected async doInit(): Promise<void> {
        this.update();
    }

    protected render(): React.ReactNode {
        return <div>
            HelloWorld
        </div>
    }
}

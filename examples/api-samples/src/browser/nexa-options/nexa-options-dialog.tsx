/* eslint-disable no-null/no-null */
/* eslint-disable @theia/shared-dependencies */
/* eslint-disable import/no-extraneous-dependencies */
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
import { inject, injectable } from '@theia/core/shared/inversify';
import { ReactDialog } from '@theia/core/lib/browser/dialogs/react-dialog';
import { DialogProps, WidgetManager } from '@theia/core/lib/browser';
import NexaOptionsEnvironmentWidget from './nexa-options-environment-widget';
import NexaOptionsFormDesignWidget from './nexa-options-form-design-widget';
import { NexaOptions, OptionsData } from '../../common/nexa-options/nexa-options-sevice';

@injectable()
export class NexaOptionsDialog extends ReactDialog<void> {
    get value(): void {
        return;
    }

    readonly ID = 'nexa-options-dialog';
    static readonly LABEL = 'Nexa Options Dialog';

    optionsData: OptionsData;

    constructor(
        @inject(DialogProps) props: DialogProps,
        @inject(WidgetManager) protected readonly widgetManager: WidgetManager,
        @inject(NexaOptions) protected readonly options: NexaOptions,
        data: OptionsData
    ) {
        super({
            title: 'Options',
        });

        this.optionsData = data;
        const defaultButton = this.appendButton('Set Default', false);
        this.appendCloseButton('cancle');
        const saveButton = this.appendAcceptButton('Save');

        defaultButton.addEventListener('click', () => {
            this.options.resetOptionsFile().then((result: boolean) => {
                if (!result)
                    throw new Error(`Options not reset`); {
                }
            });
        });

        saveButton.addEventListener('click', () => {
            this.options.saveOptionsFile(this.optionsData).then((result: boolean) => {
                if (!result)
                    throw new Error(`Options not saved`); {
                }
            });
        })
    }

    protected render(): React.ReactNode {
        return (
            <div>
                <NexaOptionsEnvironmentWidget optionsData={this.optionsData} />
                <NexaOptionsFormDesignWidget optionsData={this.optionsData} />
            </div>
        );
    }
}

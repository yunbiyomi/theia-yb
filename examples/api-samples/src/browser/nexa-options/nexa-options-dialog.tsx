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
import { WidgetManager } from '@theia/core/lib/browser';
import NexaOptionsEnvironmentWidget from './nexa-options-environment-widget';
import NexaOptionsFormDesignWidget from './nexa-options-form-design-widget';
import { NexaOptions, OptionsData } from '../../common/nexa-options/nexa-options-sevice';
import { WorkspaceCommands, WorkspaceService } from '@theia/workspace/lib/browser';
import { CommandRegistry } from '@theia/core';
import { FileDialogService, OpenFileDialogProps } from '@theia/filesystem/lib/browser';

@injectable()
export class NexaOptionsDialog extends ReactDialog<void> {
    get value(): void {
        return;
    }

    readonly ID = 'nexa-options-dialog';
    static readonly LABEL = 'Nexa Options Dialog';

    optionsData: OptionsData;

    constructor(
        @inject(CommandRegistry) protected readonly commandRegistry: CommandRegistry,
        @inject(WidgetManager) protected readonly widgetManager: WidgetManager,
        @inject(NexaOptions) protected readonly options: NexaOptions,
        @inject(WorkspaceService) protected readonly workspaceService: WorkspaceService,
        @inject(FileDialogService) protected readonly fileDialogService: FileDialogService,
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

    async doOpenFolder(): Promise<string | undefined> {
        const props: OpenFileDialogProps = {
            title: WorkspaceCommands.OPEN_FOLDER.dialogLabel,
            canSelectFolders: true,
            canSelectFiles: false,
            canSelectMany: true,
        };
        const [rootStat] = await this.workspaceService.roots;
        const targetFolders = await this.fileDialogService.showOpenDialog(props, rootStat);
        if (targetFolders) {
            const path = targetFolders.path.toString();
            this.optionsData.Configure.Environment.General.workFolder = path;
            return path
        }
        return undefined;
    }


    protected render(): React.ReactNode {
        return (
            <div>
                <NexaOptionsEnvironmentWidget optionsData={this.optionsData} onFindClick={this.doOpenFolder.bind(this)} />
                <NexaOptionsFormDesignWidget optionsData={this.optionsData} />
            </div>
        );
    }
}

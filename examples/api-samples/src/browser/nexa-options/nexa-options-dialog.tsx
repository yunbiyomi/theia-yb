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

import React, { useState } from 'react';
import { inject, injectable, postConstruct } from '@theia/core/shared/inversify';
import { ReactDialog } from '@theia/core/lib/browser/dialogs/react-dialog';
import { WidgetManager } from '@theia/core/lib/browser';
import NexaOptionsEnvironmentWidget from './nexa-options-environment-widget';
import NexaOptionsFormDesignWidget from './nexa-options-form-design-widget';
import { NexaOptions, OptionsData } from '../../common/nexa-options/nexa-options-sevice';
import { WorkspaceCommands, WorkspaceService } from '@theia/workspace/lib/browser';
import { CommandRegistry } from '@theia/core';
import { FileDialogService, OpenFileDialogProps } from '@theia/filesystem/lib/browser';
import { NexaOptionsTreeWidget } from './nexa-options-tree-widget';

@injectable()
export class NexaOptionsDialog extends ReactDialog<void> {
    get value(): void {
        return;
    }

    readonly ID = 'nexa-options-dialog';
    static readonly LABEL = 'Nexa Options Dialog';

    optionsData: OptionsData;

    @inject(NexaOptionsTreeWidget) treeWidget: NexaOptionsTreeWidget;

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
        this.appendCloseButton('Cancel');
        const saveButton = this.appendAcceptButton('Save');

        defaultButton.addEventListener('click', () => {
            this.options.resetOptionsFile().then((result: boolean) => {
                if (!result) {
                    throw new Error('Options not reset');
                }
                this.accept();
            });
        });

        saveButton.addEventListener('click', () => {
            this.options.saveOptionsFile(this.optionsData).then((result: boolean) => {
                if (!result) {
                    throw new Error('Options not saved');
                }
            });
        });
    }

    @postConstruct()
    protected init(): void {
        this.id = NexaOptionsTreeWidget.ID;
        this.title.label = NexaOptionsTreeWidget.LABEL;

        this.treeWidget.addClass('nexa-options-tree-widget');
        // this.addWidget(this.treeWidget);

        this.update();
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
            return targetFolders.path.toString();
        }
        return undefined;
    }

    protected render(): React.ReactNode {
        return <NexaOptionsDialogContent optionsData={this.optionsData} onFindClick={this.doOpenFolder.bind(this)} />;
    }
}

interface NexaOptionsDialogContentProps {
    optionsData: OptionsData;
    onFindClick: () => Promise<string | undefined>;
}

const NexaOptionsDialogContent: React.FC<NexaOptionsDialogContentProps> = ({ optionsData, onFindClick }) => {
    const [activeTab, setActiveTab] = useState<'environment' | 'formDesign'>('environment');

    return (
        <div>
            <div className='button-container'>
                <button onClick={() => setActiveTab('environment')}>Environment</button>
                <button onClick={() => setActiveTab('formDesign')}>Form Design</button>
            </div>
            {activeTab === 'environment' && (
                <NexaOptionsEnvironmentWidget optionsData={optionsData} onFindClick={onFindClick} />
            )}
            {activeTab === 'formDesign' && (
                <NexaOptionsFormDesignWidget optionsData={optionsData} />
            )}
        </div>
    );
};

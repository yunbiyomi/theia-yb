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
import { ReactWidget } from '@theia/core/lib/browser';
import { FileDialogService, OpenFileDialogProps } from '@theia/filesystem/lib/browser';
import { WorkspaceCommands, WorkspaceService } from '@theia/workspace/lib/browser';
import NexaOptionsEnvironmentWidget from './nexa-options-environment-widget';
import NexaOptionsFormDesignWidget from './nexa-options-form-design-widget';
import { NexaOptions, OptionsData } from '../../common/nexa-options/nexa-options-sevice';

@injectable()
export class NexaOptionsWidget extends ReactWidget {

    static readonly ID = 'nexa-options-widget';
    static readonly LABEL = 'Nexa Options Widget';

    protected optionsData: OptionsData;
    optionsType: string = 'environment';

    @inject(NexaOptions) protected readonly nexaOptions: NexaOptions;
    @inject(WorkspaceService) protected readonly workspaceService: WorkspaceService;
    @inject(FileDialogService) protected readonly fileDialogService: FileDialogService;

    @postConstruct()
    protected init(): void {
        this.doInit();
    }

    protected async doInit(): Promise<void> {
        this.id = NexaOptionsWidget.ID;
        this.title.label = NexaOptionsWidget.LABEL;
        this.title.caption = NexaOptionsWidget.LABEL;
        this.node.tabIndex = 0;
        this.saveOptionsData = this.saveOptionsData.bind(this);
        this.resetOptionsFile = this.resetOptionsFile.bind(this);
        this.doOpenFolder = this.doOpenFolder.bind(this);
        this.update();
    }

    public setOptionsData() {
        this.nexaOptions.readOptionsFile().then((data: OptionsData) => {
            this.optionsData = { ...data };
            this.update();
        })
    }

    public setOptionsType(type: string) {
        this.optionsType = type;
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

    protected async saveOptionsData(): Promise<void> {
        this.nexaOptions.saveOptionsFile(this.optionsData).then((result: boolean) => {
            if (!result) {
                throw new Error('Options not saved');
            }
            this.update();
        })
    }

    protected async resetOptionsFile(): Promise<void> {
        this.nexaOptions.resetOptionsFile().then((result: boolean) => {
            if (!result) {
                throw new Error('Options not reset');
            }
            this.update();
        })
    }

    protected updateEnvironmentOptions = (newData: any) => {
        this.optionsData.Configure.Environment.General = {
            ...this.optionsData.Configure.Environment.General,
            ...newData
        };
        this.update();
    }

    protected updateEnvironmentTypeOptions = (newData: any) => {
        this.optionsData.Configure.setEnvironment = newData;
        this.update();
    }

    protected updateFormDesignOptions = (newData: any) => {
        this.optionsData.Configure.FormDesign.General = {
            ...this.optionsData.Configure.FormDesign.General,
            ...newData
        };
        this.update();
    }

    protected updateDisplayEditOptions = (newData: any) => {
        this.optionsData.Configure.FormDesign.LayoutManager.displayEditStep = newData;
        this.update();
    }

    protected render(): React.ReactNode {
        return (
            <div>
                {this.optionsData &&
                    this.optionsType === 'environment' ? (
                    <NexaOptionsEnvironmentWidget
                        optionsData={this.optionsData}
                        onFindClick={this.doOpenFolder}
                        updateEnvironmentOptions={this.updateEnvironmentOptions}
                        updateEnvironmentTypeOptions={this.updateEnvironmentTypeOptions}
                    />
                ) : (
                    <NexaOptionsFormDesignWidget
                        optionsData={this.optionsData}
                        updateFormDesignOptions={this.updateFormDesignOptions}
                        updateDisplayEditOptions={this.updateDisplayEditOptions}
                    />
                )
                }
                <div className='main-button-wrap'>
                    <button className='options-button' onClick={this.resetOptionsFile}>Set default</button>
                    <button className='options-button' onClick={this.saveOptionsData}>Save</button>
                </div>
            </div>
        );
    }
}

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
// import NexaOptionsFormDesignWidget from './nexa-options-form-design-widget';
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
        this.update();
    }

    public setOptionsData() {
        this.nexaOptions.readOptionsFile().then((data: OptionsData) => {
            this.optionsData = data;
        })
        this.update();
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

    protected render(): React.ReactNode {
        return (
            <div>
                {/* {this.optionsData &&
                    this.optionsType === 'environment' ? (
                    <NexaOptionsEnvironmentWidget optionsData={this.optionsData} onFindClick={this.doOpenFolder.bind(this)} />
                ) : (
                    <NexaOptionsFormDesignWidget optionsData={this.optionsData} />
                )
                } */}
                {/* {
                    this.optionsData && (
                        <div>
                            <NexaOptionsEnvironmentWidget optionsData={this.optionsData} onFindClick={this.doOpenFolder.bind(this)} />
                            <NexaOptionsFormDesignWidget optionsData={this.optionsData} />
                        </div>
                    )
                } */}
                <NexaOptionsEnvironmentWidget optionsData={this.optionsData} onFindClick={this.doOpenFolder.bind(this)} />
                {/* <NexaOptionsFormDesignWidget optionsData={this.optionsData} /> */}
            </div>
        );
    }
}

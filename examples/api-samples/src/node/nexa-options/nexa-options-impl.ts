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

import { ConnectionHandler, RpcConnectionHandler } from '@theia/core';
import { injectable, interfaces } from '@theia/core/shared/inversify';
import { NexaOptions, NexaOptionsClient, NexaOptionsPath } from '../../common/nexa-options/nexa-options-sevice';
import { OptionsData } from '../../browser/nexa-options/nexa-options-definitions';
import fs = require('fs');
import path = require('path');

@injectable()
export class NexaOptionsImpl implements NexaOptions {
    protected client: NexaOptionsClient | undefined;

    getClient(): NexaOptionsClient | undefined {
        if (this.client !== undefined) { return this.client; }
    }

    setClient(client: NexaOptionsClient): void {
        this.client = client;
    }

    dispose(): void {
        throw new Error('Method not implemented.');
    }

    // options JSON 파일 읽고 데이터에 저장
    readOptionsFile(): Promise<OptionsData> {
        const directoryPath = '../../../../nexa-options-data.json';
        const filePath = path.join(__dirname, directoryPath);

        const jsonData = fs.readFileSync(filePath, 'utf8');
        const optionsData = JSON.parse(jsonData);

        return optionsData;
    }

    // 변경된 data options에 저장
    async saveOptionsFile(data: OptionsData): Promise<boolean> {
        if (!data) {
            return false;
        }

        const directoryPath = '../../../../nexa-options-data.json';
        const filePath = path.join(__dirname, directoryPath);

        const saveData = JSON.stringify(data);

        fs.writeFileSync(filePath, saveData, 'utf-8');
        return true;
    }

    // options 초기화
    async resetOptionsFile(data: OptionsData, type: string): Promise<boolean> {
        const initialData: OptionsData = {
            Configure: {
                Environment: {
                    General: {
                        workFolder: 'C://Users//tobesoft//Documents//tobesoft//nexacro N//settings',
                        recentFileCount: 4,
                        recentPrjCount: 4,
                        commandType: 0,
                        toolTheme: 0
                    }
                },
                FormDesign: {
                    General: {
                        undoMax: 1024,
                        defaultWidth: 1280,
                        defaultHeight: 720,
                        selectType: 0
                    },
                    LayoutManager: {
                        displayEditStep: 1
                    }
                },
                setEnvironment: 'developer'
            }
        };

        let defaultData = data;

        switch (type) {
            case 'all':
                defaultData = initialData;
                break;
            case 'environment':
                defaultData.Configure.Environment.General.workFolder = 'C://Users//tobesoft//Documents//tobesoft//nexacro N//settings'
                defaultData.Configure.Environment.General.recentFileCount = 4;
                defaultData.Configure.Environment.General.recentPrjCount = 4;
                defaultData.Configure.Environment.General.commandType = 0;
                defaultData.Configure.Environment.General.toolTheme = 0;
                defaultData.Configure.setEnvironment = 'developer';
                break;
            case 'formDesign':
                defaultData.Configure.FormDesign.General.undoMax = 1024;
                defaultData.Configure.FormDesign.General.defaultWidth = 1280;
                defaultData.Configure.FormDesign.General.defaultHeight = 720;
                defaultData.Configure.FormDesign.General.selectType = 1;
                defaultData.Configure.FormDesign.LayoutManager.displayEditStep = 1;
                break;
        }

        const result = await this.saveOptionsFile(defaultData);

        return result ? true : false;
    }
}

export const bindNexaOptionsBackend = (bind: interfaces.Bind) => {
    bind(NexaOptions).to(NexaOptionsImpl).inSingletonScope();
    bind(ConnectionHandler).toDynamicValue(ctx =>
        new RpcConnectionHandler<NexaOptionsClient>(NexaOptionsPath, client => {
            const server = ctx.container.get<NexaOptions>(NexaOptions);
            server.setClient(client);
            return server;
        })
    ).inSingletonScope();
};

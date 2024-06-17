/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @theia/runtime-import-check */
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

    // origin config File 데이터 파싱
    setOriginConfigFile(): OptionsData {
        const originConfigPath = '../../../../nexa-options-config.json';
        const joinPath = path.join(__dirname, originConfigPath);
        const originJsonData = fs.readFileSync(joinPath, 'utf-8');
        const originParseData = JSON.parse(originJsonData);
        return originParseData;
    };

    // user config File 생성/수정
    async parseOptionsFile(): Promise<OptionsData> {
        const directoryPath = '../../../../nexa-options-user-config.json';
        const filePath = path.join(__dirname, directoryPath);

        try {
            fs.statSync(filePath);
        } catch (error) {
            const originParseData = this.setOriginConfigFile();
            await this.saveOptionsFile(originParseData);
        } finally {
            const jsonData = fs.readFileSync(filePath, 'utf-8');
            const parseData = JSON.parse(jsonData);
            return parseData;
        }

    }

    // user confing File 데이터 파싱
    async readOptionsFile(): Promise<{ result?: boolean; data?: OptionsData }> {
        let originData;
        await this.parseOptionsFile().then((data: OptionsData) => {
            originData = data;
        });
        return { result: true, data: originData };
    }

    // user cofing File의 변경 내용 저장
    async saveOptionsFile(data: OptionsData): Promise<boolean> {
        if (!data) {
            return false;
        }

        const directoryPath = '../../../../nexa-options-user-config.json';
        const filePath = path.join(__dirname, directoryPath);

        const saveData = JSON.stringify(data);

        fs.writeFileSync(filePath, saveData, 'utf-8');
        return true;
    }

    // options 초기화
    async resetOptionsFile(type: string): Promise<boolean> {
        let originData: any = await this.parseOptionsFile();

        switch (type) {
            case 'all':
                originData = this.setOriginConfigFile();
                break;
            case 'environment':
                const environmentConfig = this.setOriginConfigFile();
                originData.Configure.Environment = environmentConfig.Configure.Environment;
                originData.Configure.setEnvironment = environmentConfig.Configure.setEnvironment;
                break;
            case 'formDesign':
                const formDataConfig = this.setOriginConfigFile();
                originData.Configure.FormDesign = formDataConfig.Configure.FormDesign;
                break;
        }

        if (originData) {
            const result = await this.saveOptionsFile(originData);
            return result ? true : false;

        } else {
            return false;
        }
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

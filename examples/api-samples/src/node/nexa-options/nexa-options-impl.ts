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
    parseOptionsFile(): OptionsData {
        const directoryPath = '../../../../nexa-options-data.json';
        const filePath = path.join(__dirname, directoryPath);

        const jsonData = fs.readFileSync(filePath, 'utf8');
        const parseData = JSON.parse(jsonData);

        return parseData;
    }

    async readOptionsFile(): Promise<{ result?: boolean; data?: OptionsData }> {
        const originData = this.parseOptionsFile();
        const optionsData = this.extractOptionsData(originData, 1);

        if (optionsData) {
            return { result: true, data: optionsData };
        } else {
            return { result: false };
        }
    }

    run(data: any): object {
        const originData = this.parseOptionsFile();
        const result = this.saveOptionsData(originData, data);

        this.saveOptionsFile(originData);
        return result
    }

    saveOptionsData(originData: any, data: any): object {
        if (Array.isArray(originData) && originData.length > 1) {
            originData[1] = data;
        } else if (typeof originData === 'object' && originData !== null) {
            for (const key in originData) {
                this.saveOptionsData(originData[key], data[key]);
            }
        }
        return originData;
    }

    // 원하는 배열 번호의 객체 가져오기
    extractOptionsData(originData: any, num: number): OptionsData {
        if (Array.isArray(originData) && originData.length > num) {
            return originData[num];
        } else if (typeof originData === 'object' && originData !== null) {
            const newObj: any = {};
            for (const key in originData) {
                newObj[key] = this.extractOptionsData(originData[key], num);
            }
            return newObj;
        }

        return originData;
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
    async resetOptionsFile(type: string): Promise<boolean> {
        let originData: any = this.parseOptionsFile();

        switch (type) {
            case 'all':
                originData = this.allDefaultData(originData);
                break;
            case 'environment':
                const environmentData = this.allDefaultData(originData.Configure.Environment);
                originData.Configure.Environment = environmentData;
                const defaultSetEnvironment = this.allDefaultData(originData.Configure.setEnvironment);
                originData.Configure.setEnvironment = defaultSetEnvironment;
                break;
            case 'formDesign':
                const formData = this.allDefaultData(originData.Configure.FormDesign);
                originData.Configure.FormDesign = formData;
                break;
        }

        if (originData) {
            const result = await this.saveOptionsFile(originData);
            return result ? true : false;

        } else {
            return false
        }
    }

    // default 초기화
    allDefaultData(originData: any): object {
        if (Array.isArray(originData) && originData.length > 1) {
            originData[1] = originData[0];
        } else if (typeof originData === 'object' && originData !== null) {
            for (const key in originData) {
                this.allDefaultData(originData[key]);
            }
        }
        return originData;
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

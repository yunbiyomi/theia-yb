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

import { injectable, interfaces } from '@theia/core/shared/inversify';
import { FileNode, ReadModel, ReadModelClient, ReadModelPath } from '../../common/read-model/read-model-service';
import path = require('path');
import fs = require('fs');
import { ConnectionHandler, RpcConnectionHandler } from '@theia/core';

@injectable()
export class ReadModelImpl implements ReadModel {

    protected client: ReadModelClient | undefined;

    setClient(client: ReadModelClient): void {
        this.client = client;
    }

    getClient(): ReadModelClient | undefined {
        if (this.client !== undefined) { return this.client; }
    }

    dispose(): void {
        throw new Error('Method not implemented.');
    }

    async readModel(): Promise<FileNode[]> {
        const directoryPath = '../../../../Mars_Sample/_model_';
        const modelPath = path.join(__dirname, directoryPath);

        const readDirectory = async (defaultPath: string, parentsFolder?: string): Promise<FileNode[]> => {
            const items = fs.readdirSync(defaultPath, 'utf-8');
            const files: FileNode[] = [];

            for (const item of items) {
                const itemPath = path.join(defaultPath, item);
                const stats = fs.statSync(itemPath);
                if (stats.isDirectory()) {
                    const folderNode: FileNode = {
                        id: item,
                        isDirectory: true,
                        parent: parentsFolder,
                        children: await readDirectory(itemPath, item),
                    };
                    files.push(folderNode);
                } else if (stats.isFile()) {
                    const fileNode: FileNode = {
                        id: item,
                        isDirectory: false
                    };
                    files.push(fileNode);
                }
            }
            return files;
        };

        return readDirectory(modelPath);
    }
}

export const bindReadModelWidgetBackend = (bind: interfaces.Bind) => {
    bind(ReadModel).to(ReadModelImpl).inSingletonScope();
    bind(ConnectionHandler).toDynamicValue(ctx =>
        new RpcConnectionHandler<ReadModelClient>(ReadModelPath, client => {
            const server = ctx.container.get<ReadModel>(ReadModel);
            server.setClient(client);
            return server;
        })
    ).inSingletonScope();
}

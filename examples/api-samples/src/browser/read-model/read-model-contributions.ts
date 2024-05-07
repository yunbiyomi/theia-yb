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

import { Command, CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MAIN_MENU_BAR } from '@theia/core';
import { injectable, inject } from '@theia/core/shared/inversify';
import { OutputChannelManager } from '@theia/output/lib/browser/output-channel';
import { ReadModel, ReadModelClient, FileNode } from '../../common/read-model/read-model-service'; // FileNode 추가

const RaedModelCommand: Command = {
    id: 'read-model',
    label: 'Read Model'
};

@injectable()
export class ReadModelContribution implements ReadModelClient {

    @inject(OutputChannelManager)
    protected readonly outputChannelManager: OutputChannelManager;

    public printOutputChannelManager(fileStructure: FileNode[]): void { // 인자를 FileNode[]으로 변경
        // 파일 구조를 트리로 표시하는 코드로 수정
        console.log(fileStructure); // 예시로 콘솔에 출력
    }
}

@injectable()
export class ReadModelCommandContribution implements CommandContribution {

    constructor(
        @inject(ReadModel)
        protected readonly readModel: ReadModel,
    ) { }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(RaedModelCommand, {
            execute: async () => {
                this.readModel.readModel().then((fileStructure: FileNode[]) => {
                    fileStructure.forEach((node: FileNode) => {
                        console.log(`${JSON.stringify(node)}`); // 각 파일 노드의 내용을 콘솔에 출력
                    });
                });
            }
        });
    }
}

@injectable()
export class ReadModelMenuContribution implements MenuContribution {
    registerMenus(menus: MenuModelRegistry): void {
        const subMenuPath = [...MAIN_MENU_BAR, 'Read Model'];
        menus.registerSubmenu(subMenuPath, 'Read Model', {
            order: '99999'
        });
        menus.registerMenuAction(subMenuPath, {
            commandId: RaedModelCommand.id,
            order: '0'
        });
    };
}

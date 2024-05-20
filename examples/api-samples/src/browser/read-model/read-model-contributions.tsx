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

import { Command, CommandRegistry, MenuModelRegistry, MAIN_MENU_BAR, QuickInputService, QuickPickItemOrSeparator, QuickPickItem } from '@theia/core';
import { injectable, inject, interfaces } from '@theia/core/shared/inversify';
import { AbstractViewContribution, bindViewContribution, codicon, FrontendApplicationContribution, QuickViewService, Widget, WidgetFactory } from '@theia/core/lib/browser';
import { ReadModelClient, ReadModel, ReadModelPath, FileNode } from '../../common/read-model/read-model-service';
import { ExpandTypeNode, ReadModelWidget, TypeNode } from './read-model-widget';
import { ServiceConnectionProvider } from '@theia/core/lib/browser/messaging/service-connection-provider';
import { TabBarToolbarContribution, TabBarToolbarRegistry } from '@theia/core/lib/browser/shell/tab-bar-toolbar';

export const ReadModelCommand: Command = {
    id: ReadModelWidget.ID,
    label: ReadModelWidget.LABEL
};

export const NodeAddToolBarCommand: Command = {
    id: 'node-add-toolbar',
    iconClass: codicon('add')
};

export const NodeDeleteToolBarCommand: Command = {
    id: 'node-delete-toolbar',
    iconClass: codicon('chrome-minimize')
};

export const NodeQuickView: Command = {
    id: 'node-quick-view'
};

@injectable()
export class ReadModelFrontend implements ReadModelClient {
}

@injectable()
export class ReadModelContribution extends AbstractViewContribution<ReadModelWidget> implements TabBarToolbarContribution {

    @inject(CommandRegistry) protected readonly commandRegistry: CommandRegistry;
    @inject(ReadModel) protected readonly readModel: ReadModel;
    @inject(ReadModelWidget) protected readonly readModelWidget: ReadModelWidget;
    @inject(QuickViewService) protected readonly quickViewService: QuickViewService;
    @inject(QuickInputService) protected readonly quickInputService: QuickInputService;

    constructor() {
        super({
            widgetId: ReadModelWidget.ID,
            widgetName: ReadModelWidget.LABEL,
            defaultWidgetOptions: { area: 'left' },
            toggleCommandId: ReadModelCommand.id
        });
    }

    // menu 생성
    override registerMenus(menus: MenuModelRegistry): void {
        const subMenuPath = [...MAIN_MENU_BAR, 'Read Model'];
        menus.registerSubmenu(subMenuPath, 'Read Model', {
            order: '99999'
        });

        menus.registerMenuAction(subMenuPath, {
            commandId: ReadModelCommand.id,
            order: '0'
        });
    }

    // command 생성
    override registerCommands(registry: CommandRegistry): void {
        // 트리 위젯 호출
        registry.registerCommand(ReadModelCommand, {
            execute: async () => {
                this.readModel.readModel().then((fileNode: FileNode[]) => {
                    super.openView({ activate: false, reveal: true });
                    this.readModelWidget.getReadModel(fileNode);
                });
            }
        });

        // Add Tabber Command
        registry.registerCommand(NodeAddToolBarCommand, {
            execute: () => {
                this.addFileQuickView(this.readModelWidget);
            },
            isEnabled: widget => this.withWidget(widget, () => {
                const selectNode = this.readModelWidget.model.selectedNodes[0] as ExpandTypeNode;
                const type = selectNode?.type;
                return type === 'model' || type === 'file';
            }),
            isVisible: widget => this.withWidget(widget, () => true),
        });

        // Delete Tabbar Command
        registry.registerCommand(NodeDeleteToolBarCommand, {
            execute: () => {
                try {
                    const selectNode = this.readModelWidget.model.selectedNodes[0] as TypeNode;
                    const nodeName = selectNode.id
                    const path = selectNode.description as string;
                    const type = selectNode.type;
                    const parentName = selectNode.parent?.id as string;

                    const nodeDeleteResult = this.readModel.deleteNode(nodeName, path, type, parentName);

                    if (nodeDeleteResult) {
                        this.readModelWidget.deleteNode(selectNode);
                    }
                } catch (error) {
                    console.error('Node cannot be deleted', error);
                }
            },
            isEnabled: widget => this.withWidget(widget, () => {
                const selectNode = this.readModelWidget.model.selectedNodes[0] as ExpandTypeNode;
                const type = selectNode?.type;
                return type === 'model' || type === 'field';
            }),
            isVisible: widget => this.withWidget(widget, () => true),
        });
    }

    // Tabbar 설정
    async registerToolbarItems(registry: TabBarToolbarRegistry): Promise<void> {
        registry.registerItem({
            id: NodeAddToolBarCommand.id,
            command: NodeAddToolBarCommand.id,
            tooltip: 'Node Add',
            priority: 0
        });

        registry.registerItem({
            id: NodeDeleteToolBarCommand.id,
            command: NodeDeleteToolBarCommand.id,
            tooltip: 'Node Delete',
            priority: 1
        });
    }

    protected withWidget<T>(widget: Widget | undefined = this.tryGetWidget(), cb: (bulkEdit: ReadModelWidget) => T): T | false {
        if (widget instanceof ReadModelWidget) {
            return cb(widget);
        }
        return false;
    }

    // Quick Input 생성
    protected async addFileQuickView(widget: ReadModelWidget | undefined): Promise<void> {
        const items: QuickPickItemOrSeparator[] = [];
        const selectNode = this.readModelWidget.model.selectedNodes[0] as TypeNode;
        const nodeName = selectNode.id;
        const path = selectNode.description as string;
        const type = selectNode.type;
        const newNodeRegex = /^[A-Za-z][A-Za-z0-9_]*$/;
        let quickViewTitle = 'Create';
        let quickViewContent = 'Enter Name...';

        if (widget && this.readModelWidget.model.selectedNodes) {
            switch (type) {
                case 'file':
                    quickViewTitle = 'Create Model';
                    quickViewContent = 'Enter Model Name...';
                    break;
                case 'model':
                    quickViewTitle = 'Create Field';
                    quickViewContent = 'Enter Field Name...';
                    break;
                default:
                    break;
            }
        }

        const addNewNode: QuickPickItem & { value?: string } = {
            id: NodeQuickView.id,
            label: 'Create New File'
        };

        this.quickInputService.showQuickPick(items, {
            title: quickViewTitle,
            placeholder: quickViewContent,
            canSelectMany: false,
            onDidChangeValue: picker => {
                if (picker.value) {
                    addNewNode.alwaysShow = true;
                    addNewNode.value = picker.value;
                    addNewNode.label = `${quickViewTitle}:  ${picker.value}`;

                    if (newNodeRegex.test(picker.value)) {
                        addNewNode.description = '';
                        addNewNode.execute = async () => {
                            try {
                                const value = addNewNode.value as string;
                                const nodeAddResult = this.readModel.addNode(nodeName, path, type, value);
                                if (nodeAddResult) {
                                    this.readModelWidget.addNewNode(selectNode, type, addNewNode?.value);
                                }
                            } catch (error) {
                                console.error('Node cannot be added', error);
                            }
                        };
                    } else {
                        addNewNode.description = '이름 형식이 올바르지 않습니다! 다시 입력해주세요.';
                    }

                    picker.items = [...items, addNewNode];
                }
            }
        });
    }
};

export const bindReadModelWidget = (bind: interfaces.Bind) => {
    bind(ReadModelClient).to(ReadModelFrontend).inSingletonScope();
    bind(ReadModel).toDynamicValue(ctx => {
        const connection = ctx.container.get(ServiceConnectionProvider);
        const client = ctx.container.get<ReadModelClient>(ReadModelClient);
        return connection.createProxy<ReadModel>(ReadModelPath, client);
    }).inSingletonScope();
    bindViewContribution(bind, ReadModelContribution);
    bind(TabBarToolbarContribution).toService(ReadModelContribution);
    bind(FrontendApplicationContribution).toService(ReadModelContribution);
    bind(ReadModelWidget).toDynamicValue(ctx => ReadModelWidget.createWidget(ctx.container)).inSingletonScope();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: ReadModelWidget.ID,
        createWidget: () => ctx.container.get<ReadModelWidget>(ReadModelWidget)
    })).inSingletonScope();
};

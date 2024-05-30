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
// eslint-disable-next-line max-len
import { AbstractViewContribution, ApplicationShell, bindViewContribution, codicon, CommonCommands, CommonMenus, FrontendApplicationContribution, Keybinding, KeybindingContext, KeybindingRegistry, LabelProvider, QuickViewService, Widget, WidgetFactory } from '@theia/core/lib/browser';
import { ReadModelClient, ReadModel, ReadModelPath, ParseNode } from '../../common/read-model/read-model-service';
import { ReadModelWidget, TypeNode } from './read-model-widget';
import { LocalConnectionProvider, ServiceConnectionProvider } from '@theia/core/lib/browser/messaging/service-connection-provider';
import { TabBarToolbarContribution, TabBarToolbarRegistry } from '@theia/core/lib/browser/shell/tab-bar-toolbar';
import { OutputChannelManager, OutputChannelSeverity } from '@theia/output/lib/browser/output-channel';

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

export const TreeUndo: Command = {
    id: 'tree-undo',
    label: 'Tree Undo'
};

export const TreeRedo: Command = {
    id: 'tree-redo',
    label: 'Tree Redo'
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
    @inject(LabelProvider) protected readonly labelProvider: LabelProvider;
    @inject(OutputChannelManager) protected readonly outputChannelManager: OutputChannelManager;

    constructor() {
        super({
            widgetId: ReadModelWidget.ID,
            widgetName: ReadModelWidget.LABEL,
            defaultWidgetOptions: { area: 'left' },
            toggleCommandId: ReadModelCommand.id
        });
    }

    isTreeWidget(arg?: Keybinding): boolean {
        const widget = this.shell.activeWidget;
        return widget instanceof ReadModelWidget;
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

        menus.unregisterMenuAction(CommonCommands.UNDO);
        menus.unregisterMenuAction(CommonCommands.REDO);

        menus.registerMenuAction(CommonMenus.EDIT_UNDO, {
            commandId: TreeUndo.id,
            order: '0'
        });

        menus.registerMenuAction(CommonMenus.EDIT_UNDO, {
            commandId: TreeRedo.id,
            order: '1'
        });
    }

    // command 생성
    override registerCommands(registry: CommandRegistry): void {
        // 트리 위젯 호출
        registry.registerCommand(ReadModelCommand, {
            execute: async () => {
                this.readModel.readModel().then((parseNode: ParseNode[]) => {
                    super.openView({ activate: false, reveal: true });
                    this.readModelWidget.getReadTree(parseNode, 'readModel');
                });
            }
        });

        // Add Tabber Command
        registry.registerCommand(NodeAddToolBarCommand, {
            execute: () => {
                this.addFileQuickInput(this.readModelWidget);
            },
            isEnabled: widget => this.withWidget(widget, () => this.checkEnabled('add')),
            isVisible: widget => this.withWidget(widget, () => true),
        });

        // Delete Tabbar Command
        registry.registerCommand(NodeDeleteToolBarCommand, {
            execute: () => {
                this.deleteNodeHandler();
            },
            isEnabled: widget => this.withWidget(widget, () => this.checkEnabled('delete')),
            isVisible: widget => this.withWidget(widget, () => true),
        });

        registry.unregisterCommand(CommonCommands.UNDO);
        registry.unregisterCommand(CommonCommands.REDO);

        registry.registerCommand(TreeUndo, {
            execute: () => {
                this.readModelWidget.runUndo().then(() => {
                    console.log('Undo');
                });
            },
            isEnabled: () => this.readModelWidget.canUndo()
        })

        registry.registerCommand(TreeRedo, {
            execute: () => {
                this.readModelWidget.runRedo().then(() => {
                    console.log('Redo');
                });
            },
            isEnabled: () => this.readModelWidget.canRedo()
        })
    }

    override registerKeybindings(keybindings: KeybindingRegistry): void {
        keybindings.unregisterKeybinding(CommonCommands.UNDO);
        keybindings.unregisterKeybinding(CommonCommands.REDO);

        keybindings.registerKeybindings(
            {
                command: TreeUndo.id,
                keybinding: 'ctrlcmd+z',
                context: 'readModelKeybindingContext'
            },
            {
                command: TreeRedo.id,
                keybinding: 'ctrlcmd+y',
                context: 'readModelKeybindingContext'
            }
        )
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

    // tabbar Enabled check
    protected checkEnabled(tabType: string): boolean {
        const selectNode = this.readModelWidget.model.selectedNodes[0] as TypeNode;
        if (!selectNode) {
            return false;
        }
        const selectNodeType = selectNode.type;
        const childrenCount = selectNode.children.length;

        switch (tabType) {
            case 'add':
                return childrenCount !== 0 && selectNodeType === 'file' || selectNodeType === 'model' || selectNodeType === 'field';
            case 'delete':
                return selectNodeType === 'model' || selectNodeType === 'field';
            default:
                return false
        }
    }

    // ReadModel OutputChannel
    protected readModelOutput(message: string): void {
        const channel = this.outputChannelManager.getChannel('Read Model');
        channel.appendLine(message, OutputChannelSeverity.Error);
        channel.show();
    }

    // add Tabbar execute
    protected async addFileQuickInput(widget: ReadModelWidget | undefined): Promise<void> {
        const items: QuickPickItemOrSeparator[] = [];
        const selectNode = this.readModelWidget.model.selectedNodes[0] as TypeNode;
        const nodeName = selectNode.id;
        let nodeParentName: string;
        const path = this.labelProvider.getLongName(selectNode);
        const type = selectNode.type;

        if (selectNode.parent) {
            nodeParentName = selectNode.parent.id;
        }

        let quickInputTitle = 'Create';
        let quickInputContent = 'Enter Name...';

        if (widget && this.readModelWidget.model.selectedNodes) {
            switch (type) {
                case 'folder':
                    break;
                case 'file':
                    quickInputTitle = 'Create Model';
                    quickInputContent = 'Enter Model Name...';
                    break;
                case 'model':
                    quickInputTitle = 'Create Field';
                    quickInputContent = 'Enter Field Name...';
                    break;
                case 'field':
                    quickInputTitle = 'Create Field';
                    quickInputContent = 'Enter Field Name...';
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
            title: quickInputTitle,
            placeholder: quickInputContent,
            canSelectMany: false,
            onDidChangeValue: picker => {
                if (picker.value) {
                    addNewNode.alwaysShow = true;
                    addNewNode.value = picker.value;
                    addNewNode.label = `${quickInputTitle}:  ${picker.value}`;

                    // Id 유효성 검사
                    this.readModel.checkIdRegex(picker.value).then((checkIdResult) => {
                        const { isValid, errorMsg } = checkIdResult;
                        if (isValid) {
                            addNewNode.description = '';
                            addNewNode.execute = async () => {
                                const idValue = addNewNode.value as string;
                                // 새로운 Node 추가
                                this.readModel.addNodeServer(nodeName, path, type, idValue, nodeParentName).then((result: boolean) => {
                                    if (result) {
                                        this.readModelWidget.addNode(selectNode, type, idValue);
                                    }
                                });
                            };
                        } else {
                            // Node 추가 실패
                            if (errorMsg) {
                                addNewNode.description = errorMsg;
                                addNewNode.execute = async () => {
                                    this.readModelOutput(errorMsg);
                                };
                            }
                        }
                        picker.items = [...items, addNewNode];
                    });
                }
            }
        });
    }

    // delete tabbar execute 
    protected deleteNodeHandler(): void {
        const selectNode = this.readModelWidget.model.selectedNodes[0] as TypeNode;
        const nodeName = selectNode.id;
        const path = this.labelProvider.getLongName(selectNode);
        const type = selectNode.type;
        const parentName = selectNode.parent?.id as string;

        this.readModel.deleteNode(nodeName, path, type, parentName).then((result: boolean) => {
            if (result) {
                this.readModelWidget.deleteNode(selectNode);
            }
        });
    }

};

export const bindReadModelWidget = (bind: interfaces.Bind) => {
    bind(ReadModelClient).to(ReadModelFrontend).inSingletonScope();
    bind(ReadModel).toDynamicValue(ctx => {
        const connection = ctx.container.get<ServiceConnectionProvider>(LocalConnectionProvider);
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
    bind(ReadModelKeybindingContext).toSelf().inSingletonScope();
    bind(KeybindingContext).toService(ReadModelKeybindingContext);
};

@injectable()
export class ReadModelKeybindingContext implements KeybindingContext {
    readonly id = 'readModelKeybindingContext';

    @inject(ApplicationShell)
    protected readonly shell: ApplicationShell;

    isEnabled(arg?: Keybinding): boolean {
        const widget = this.shell.activeWidget || this.shell.currentWidget;
        return widget instanceof ReadModelWidget;
    }
}

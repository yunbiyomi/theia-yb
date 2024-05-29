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

import { inject, injectable } from '@theia/core/shared/inversify';
import { ApplicationShell, LabelProvider, TreeModelImpl, WidgetManager } from '@theia/core/lib/browser';
import { nodeType, ParseNode, ReadModel } from '../../common/read-model/read-model-service';
import { EditorManager } from '@theia/editor/lib/browser';
import { MonacoEditorProvider } from '@theia/monaco/lib/browser/monaco-editor-provider';
import { ExpandTypeNode, ReadModelWidget, TypeNode } from './read-model-widget';
import { URI } from '@theia/core';

@injectable()
export class ReadModelTreeModel extends TreeModelImpl {

    @inject(LabelProvider) protected readonly labelProvider: LabelProvider;
    @inject(ReadModel) protected readonly readModel: ReadModel;
    @inject(WidgetManager) protected readonly widgetManager: WidgetManager;
    @inject(ApplicationShell) protected readonly applicationShell: ApplicationShell;
    @inject(EditorManager) protected readonly editorManager: EditorManager;
    @inject(MonacoEditorProvider) protected readonly monacoEditorProvider: MonacoEditorProvider;

    protected override async doOpenNode(node: ExpandTypeNode) {
        const filePath = this.labelProvider.getLongName(node);
        const doOpenNodeType: nodeType = node.type;
        const widget = await this.widgetManager.getWidget<ReadModelWidget>('read-model-widget');
        const nodeURI = URI.fromFilePath(filePath);
        const monacoEditor = await this.monacoEditorProvider.get(nodeURI);

        // 코드 편집창에서 save 동작 시
        if (widget) {
            monacoEditor.document.onDidSaveModel(() => {
                this.readModel.readChangeFile(filePath).then((isChanged: boolean) => {
                    if (isChanged) {
                        this.readModel.parseModel(filePath).then((xmlNodes: ParseNode[] | undefined) => {
                            if (!xmlNodes) {
                                return
                            }
                            widget.getReadTree(xmlNodes, 'readXml', node);
                        });
                    }
                });
            })

            // Xml파일인 경우
            if (node.id.includes('.xmodel')) {
                if (node.children.length === 0) {
                    this.readModel.parseModel(filePath).then((xmlNodes: ParseNode[] | undefined) => {
                        if (!xmlNodes) {
                            return
                        }
                        widget.getReadTree(xmlNodes, 'readXml', node);
                    });

                    if (!node.expanded) {
                        this.expandNode(node);
                    }
                }
            }

            // model이나 field 클릭시 해당 파일로 이동
            if (doOpenNodeType === 'model' || doOpenNodeType === 'field') {
                await widget.openCodeEditor(nodeURI);
            }
        }

        super.doOpenNode(node);

    }


    override selectNode(node: TypeNode): void {
        super.selectNode(node);
        this.applicationShell.leftPanelHandler.toolBar.update();
    }
}

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
import { SelectableTreeNode, TreeModelImpl } from '@theia/core/lib/browser';
import { OptionsNode } from './nexa-options-tree-widget';
import { NexaOptionsWidget } from '../nexa-options-widget';

@injectable()
export class NexaOptionsTreeModel extends TreeModelImpl {

    @inject(NexaOptionsWidget) protected readonly optionsWidget: NexaOptionsWidget;

    // 카테고리 별 알맞은 options 창 열기
    override selectNode(node: OptionsNode): void {
        super.selectNode(node);

        if (SelectableTreeNode.is(node)) {
            if (node.parent) {
                if (node.parent.id === 'environment') {
                    this.optionsWidget.setOptionsType('environment');
                } else if (node.parent.id === 'form-design') {
                    this.optionsWidget.setOptionsType('formDesign');
                }
            }
        }
    }
}

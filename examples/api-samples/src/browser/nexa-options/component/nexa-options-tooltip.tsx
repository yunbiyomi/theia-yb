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

import React from '@theia/core/shared/react';
import { BsQuestionCircle } from 'react-icons/bs';

interface NexaOptionsTooltipProps {
    title: string;
    content: string;
    handleMouseOver: (type: string, data: boolean) => void;
    mouseOverResult: boolean;
    tooltipMsg: string;
}

export default function NexaOptionsTooltip(props: NexaOptionsTooltipProps): React.JSX.Element {
    return (
        <div className='label-wrap'>
            <p className='count-input-label'>{props.title}</p>
            <button className='explanation-button'
                onMouseOver={() => props.handleMouseOver(props.content, true)}
                onMouseOut={() => props.handleMouseOver(props.content, false)}
            >
                <BsQuestionCircle size='1rem' color='#CCC' />
                {props.mouseOverResult && (
                    <span className='tooltip'>
                        <span className='text'>{props.tooltipMsg}</span>
                    </span>
                )}
            </button>
        </div>
    )
}

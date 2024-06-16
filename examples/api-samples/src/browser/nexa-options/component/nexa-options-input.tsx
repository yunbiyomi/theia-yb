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
import NexaOptionsTooltip from './nexa-options-tooltip';

interface NexaOptionsInputProps {
    title: string;
    value: number;
    formDesignName: string;
    mouseOverName: string;
    mouseOverResult: boolean;
    tooltipMsg: string;
    errorMsg: string | undefined;
    errorResult: boolean | undefined;
    handleMouseOver: (type: string, data: boolean) => void;
    handleInputChange: (type: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function NexaOptionsInput(props: NexaOptionsInputProps): React.JSX.Element {
    return (
        <div className='options-input-wrap'>
            <NexaOptionsTooltip
                title={props.title}
                content={props.mouseOverName}
                handleMouseOver={props.handleMouseOver}
                mouseOverResult={props.mouseOverResult}
                tooltipMsg={props.tooltipMsg}
            />
            <div className={`textInputWrapper ${props.errorResult && 'error-line'}`}>
                <input
                    placeholder={props.mouseOverName}
                    value={props.value}
                    className='textInput'
                    onChange={props.handleInputChange(props.formDesignName)}
                />
            </div>
            {props.errorResult && <span className='error-message'>{props.errorMsg}</span>}
        </div>
    );
}

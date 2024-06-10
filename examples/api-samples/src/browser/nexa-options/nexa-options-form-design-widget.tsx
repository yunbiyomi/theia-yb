/* eslint-disable no-unused-expressions */
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
import { OptionsData } from '../../common/nexa-options/nexa-options-sevice';

interface NexaOptionsFormDesignWidgetProps {
    optionsData: OptionsData;
}

export default function NexaOptionsFormDesignWidget(props: NexaOptionsFormDesignWidgetProps): React.JSX.Element {
    const optionData = props.optionsData;
    console.log(JSON.stringify(optionData));


    return (
        <section className='options-container'>
            <div className='design-basic-wrap'>
                <p className='development-title'>Design Basic</p>
                <div className='options-input-wrap'>
                    <p className='input-label'>Max Undo</p>
                    <input className='options-input' />
                </div>
                <div className='options-input-wrap'>
                    <p className='input-label'>Default Width (px)</p>
                    <input />
                </div>
                <div className='options-input-wrap'>
                    <p className='input-label'>Default Height (px)</p>
                    <input />
                </div>
            </div>
            <div className='select-type options-input-wrap'>
                <p className='title'>Select Type</p>
                <select className='select-input'>
                    <option value="0">All</option>
                    <option value="1">Part</option>
                </select>
                <div />
            </div>
            <div>
                <p className='title'>Layout</p>
                <input id='overline-layout' type='checkbox' />
                <label htmlFor='overline-layout'>Outline a step when you mouse over it.</label>
            </div>
        </section>
    );
}

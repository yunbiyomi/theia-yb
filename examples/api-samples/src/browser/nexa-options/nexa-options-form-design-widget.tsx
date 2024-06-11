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
import { BsQuestionCircle } from "react-icons/bs";

interface NexaOptionsFormDesignWidgetProps {
    optionsData: OptionsData;
}

export default function NexaOptionsFormDesignWidget(props: NexaOptionsFormDesignWidgetProps): React.JSX.Element {
    const initialFormDesignState = {
        undoMax: 1024,
        defaultWidth: 1280,
        defaultHeight: 720,
        selectType: 0
    }
    const [formDesign] = React.useState(initialFormDesignState);
    const [undoMouseOver, setUndoMouseOver] = React.useState(false);
    const [widthMouseOver, setWidthMouseOver] = React.useState(false);
    const [heightMouseOver, setHeightMouseOver] = React.useState(false);
    const [perspectiveMouseOver, setPrespectiveMouseOver] = React.useState(false);

    return (
        <section className='options-container'>
            <div className='design-basic-wrap options-wrap'>
                <p className='title'>Design Basic</p>
                <div className='options-input-wrap'>
                    <div className='label-wrap'>
                        <p className='count-input-label'>Max Undo</p>
                        <button className='explanation-button' onMouseOver={() => setUndoMouseOver(true)} onMouseOut={() => setUndoMouseOver(false)}>
                            <BsQuestionCircle size='1rem' color='#CCC' />
                            {undoMouseOver && (
                                <span className="tooltip">
                                    <span className="text">
                                        Maximum number of times you can recover to Undo
                                    </span>
                                </span>
                            )}
                        </button>

                    </div>
                    <div className="textInputWrapper">
                        <input placeholder="Max Undo" value={formDesign.undoMax} className="textInput" />
                    </div>
                </div>
                <div className='options-input-wrap'>
                    <div className='label-wrap'>
                        <p className='count-input-label'>Default Width (px)</p>
                        <button className='explanation-button' onMouseOver={() => setWidthMouseOver(true)} onMouseOut={() => setWidthMouseOver(false)}>
                            <BsQuestionCircle size='1rem' color='#CCC' />
                            {widthMouseOver && (
                                <span className="tooltip">
                                    <span className="text">
                                        Set the default width when creating a new form
                                    </span>
                                </span>
                            )}
                        </button>
                    </div>
                    <div className="textInputWrapper">
                        <input placeholder="Width" value={formDesign.defaultWidth} className="textInput" />
                    </div>
                </div>
                <div className='options-input-wrap'>
                    <div className='label-wrap'>
                        <p className='count-input-label'>Default Height (px)</p>
                        <button className='explanation-button' onMouseOver={() => setHeightMouseOver(true)} onMouseOut={() => setHeightMouseOver(false)}>
                            <BsQuestionCircle size='1rem' color='#CCC' />
                            {heightMouseOver && (
                                <span className="tooltip">
                                    <span className="text">
                                        Set the default height when creating a new form
                                    </span>
                                </span>
                            )}
                        </button>
                    </div>
                    <div className="textInputWrapper">
                        <input placeholder="Height" value={formDesign.defaultHeight} className="textInput" />
                    </div>
                </div>
            </div>
            <div className='select-type options-wrap'>
                <p className='title'>Select Type</p>
                <div className='container' id='perspective'>
                    <div className='label-wrap tabs-input'>
                        <p className='count-input-label'>Perspective</p>
                        <button className='explanation-button' onMouseOver={() => setPrespectiveMouseOver(true)} onMouseOut={() => setPrespectiveMouseOver(false)}>
                            <BsQuestionCircle size='1rem' color='#CCC' />
                            {perspectiveMouseOver && (
                                <span className="tooltip">
                                    <span className="text">
                                        Set a decision point when selecting a component with the mouse
                                    </span>
                                </span>
                            )}
                        </button>
                    </div>
                    <div className='tabs'>
                        <input type="radio" id="radio-1" name="tabs-perspective" checked />
                        <label className="tab" htmlFor="radio-1">All</label>
                        <input type="radio" id="radio-2" name="tabs-perspective" />
                        <label className="tab" htmlFor="radio-2">Part</label>
                        <span className="glider1"></span>
                    </div>
                </div>
            </div>
            <div className='layout-wrap options-wrap'>
                <p className='title'>Layout</p>
                <label htmlFor='overline-layout' className="checkbox-container">
                    <input id='overline-layout' className="custom-checkbox" type="checkbox" checked />
                    <span className="checkmark"></span>
                    Outline a step when you mouse over it.
                </label>
            </div>
        </section>
    );
}

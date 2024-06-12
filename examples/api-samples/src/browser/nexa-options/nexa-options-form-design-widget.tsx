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
    updateFormDesignOptions: (newData: any) => void;
    updateDisplayEditOptions: (newData: any) => void;
}

export default function NexaOptionsFormDesignWidget(props: NexaOptionsFormDesignWidgetProps): React.JSX.Element {
    const data = props.optionsData.Configure.FormDesign;
    const initialFormDesignState = {
        undoMax: data.General.undoMax,
        defaultWidth: data.General.defaultWidth,
        defaultHeight: data.General.defaultHeight,
        selectType: data.General.selectType
    }
    const [formDesign, setformDesign] = React.useState(initialFormDesignState);
    const [displayEditStep, setDisplayEditStep] = React.useState(data.LayoutManager.displayEditStep);
    const [widthError, setWidthError] = React.useState(false);
    const [heightError, setHeightError] = React.useState(false);
    const [undoMouseOver, setUndoMouseOver] = React.useState(false);
    const [widthMouseOver, setWidthMouseOver] = React.useState(false);
    const [heightMouseOver, setHeightMouseOver] = React.useState(false);
    const [perspectiveMouseOver, setPrespectiveMouseOver] = React.useState(false);

    React.useEffect(() => {
        props.updateFormDesignOptions(formDesign);
    }, [formDesign]);

    React.useEffect(() => {
        props.updateDisplayEditOptions(displayEditStep);
    }, [displayEditStep]);

    React.useEffect(() => {
        const isMaxWidth = formDesign.defaultWidth > 12000;

        isMaxWidth ? setWidthError(true) : setWidthError(false);

    }, [formDesign.defaultWidth]);

    React.useEffect(() => {
        const isMaxHeight = formDesign.defaultHeight > 12000;

        isMaxHeight ? setHeightError(true) : setHeightError(false);

    }, [formDesign.defaultHeight]);

    const handleInputChange = (type: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        switch (type) {
            case 'maxUndo':
                setformDesign(prevData => ({
                    ...prevData,
                    undoMax: value === '' ? 0 : parseInt(value)
                }));
                break;
            case 'defaultWidth':
                setformDesign(prevData => ({
                    ...prevData,
                    defaultWidth: value === '' ? 0 : parseInt(value)
                }));
                break;
            case 'defaultHeight':
                setformDesign(prevData => ({
                    ...prevData,
                    defaultHeight: value === '' ? 0 : parseInt(value)
                }));
                break;
            case 'selectType':
                setformDesign(prevData => ({
                    ...prevData,
                    selectType: parseInt(value)
                }));
                break;
        }
    };

    const handleDisplayEditStepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDisplayEditStep = e.target.checked ? 1 : 0;
        setDisplayEditStep(newDisplayEditStep);
    };

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
                        <input placeholder="Max Undo" value={formDesign.undoMax} className="textInput" onChange={handleInputChange('maxUndo')} />
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
                    <div className={`textInputWrapper ${widthError && 'error-line'}`}>
                        <input placeholder="Width" value={formDesign.defaultWidth} className="textInput" onChange={handleInputChange('defaultWidth')} />
                    </div>
                    {widthError && <span className='error-message'>Only up to 12000 can be entered</span>}
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
                    <div className={`textInputWrapper ${heightError && 'error-line'}`}>
                        <input placeholder="Height" value={formDesign.defaultHeight} className="textInput" onChange={handleInputChange('defaultHeight')} />
                    </div>
                    {heightError && <span className='error-message'>Only up to 12000 can be entered</span>}
                </div>
            </div>
            <div className='development-tools options-wrap'>
                <div className='select-type'>
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
                            <input type="radio" id="radio-1" name="tabs-perspective" value={1} checked={formDesign.selectType === 1} onChange={handleInputChange('selectType')} />
                            <label className="tab" htmlFor="radio-1">All</label>
                            <input type="radio" id="radio-2" name="tabs-perspective" value={0} checked={formDesign.selectType === 0} onChange={handleInputChange('selectType')} />
                            <label className="tab" htmlFor="radio-2">Part</label>
                            <span className="glider1"></span>
                        </div>
                        {formDesign.selectType === 1 ?
                            <p className='select-type-content'>Options that are selected only when the selection includes the entire component.</p> :
                            <p className='select-type-content'>Options that are selected even if the selection includes some of the components.</p>
                        }
                    </div>
                </div>
                <div className={`ex-image select-type-imgae ${formDesign.selectType === 1 ? 'select-all' : 'select-part'}`} />
            </div>
            <div className='layout-wrap options-wrap'>
                <p className='title'>Layout</p>
                <label htmlFor='overline-layout' className="checkbox-container">
                    <input id='overline-layout' className="custom-checkbox" type="checkbox" checked={displayEditStep === 1} onChange={handleDisplayEditStepChange} />
                    <span className="checkmark"></span>
                    Outline a step when you mouse over it.
                </label>
            </div>
        </section>
    );
}

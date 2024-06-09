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
    const data = props.optionsData.Configure.FormDesign;
    const formDesignData = data.General;
    const [widthError, setWidthError] = React.useState(false);
    const [heightError, setHeightError] = React.useState(false);
    const [displayEditStep, setDisplayEditStep] = React.useState(data.LayoutManager.displayEditStep);
    const [formDesign, setformDesign] = React.useState({
        undoMax: formDesignData.undoMax,
        defaultWidth: formDesignData.defaultWidth,
        defaultHeight: formDesignData.defaultHeight,
        selectType: formDesignData.selectType
    });

    React.useEffect(() => {
        props.optionsData.Configure.FormDesign.General = formDesign;
    }, [formDesign]);

    React.useEffect(() => {
        props.optionsData.Configure.FormDesign.LayoutManager.displayEditStep = displayEditStep;
    }, [displayEditStep]);

    React.useEffect(() => {
        const isMaxWidth = formDesign.defaultWidth > 12000;

        isMaxWidth ? setWidthError(true) : setWidthError(false);

    }, [formDesign.defaultWidth]);

    React.useEffect(() => {
        const isMaxHeight = formDesign.defaultHeight > 12000;

        isMaxHeight ? setHeightError(true) : setHeightError(false);

    }, [formDesign.defaultHeight]);

    const handleSelectTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSelectType = parseInt(e.target.value);
        setformDesign(prevData => ({
            ...prevData,
            selectType: newSelectType
        }));
    };

    const handleDisplayEditStepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDisplayEditStep = e.target.checked ? 1 : 0;
        setDisplayEditStep(newDisplayEditStep);
    };

    const handleInputChange = (type: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        switch (type) {
            case 'maxUndo':
                setformDesign(prevData => ({
                    ...prevData,
                    undoMax: value
                }));
                break;
            case 'defaultWidth':
                setformDesign(prevData => ({
                    ...prevData,
                    defaultWidth: value
                }));
                break;
            case 'defaultHeight':
                setformDesign(prevData => ({
                    ...prevData,
                    defaultHeight: value
                }));
                break;
        }
    };

    return (
        <section className='form-design-options'>
            <div className='design-basic-wrap'>
                <p className='development-title'>Design Basic</p>
                <div className='options-input-wrap'>
                    <p className='input-label'>Max Undo</p>
                    <input className='options-input' value={formDesign.undoMax} onChange={handleInputChange('maxUndo')} />
                </div>
                <div className='options-input-wrap'>
                    <p className='input-label'>Default Width (px)</p>
                    <input className={`options-input ${widthError ? 'error-border' : ''}`} value={formDesign.defaultWidth} onChange={handleInputChange('defaultWidth')} />
                    {widthError && <span className='error-message'>Only up to 12000 can be entered</span>}
                </div>
                <div className='options-input-wrap'>
                    <p className='input-label'>Default Height (px)</p>
                    <input className={`options-input ${heightError ? 'error-border' : ''}`} value={formDesign.defaultHeight} onChange={handleInputChange('defaultHeight')} />
                    {heightError && <span className='error-message'>Only up to 12000 can be entered</span>}
                </div>
            </div>
            <div className='select-type options-input-wrap'>
                <p className='title'>Select Type</p>
                <select className='select-input' value={formDesign.selectType} onChange={handleSelectTypeChange}>
                    <option value="0">All</option>
                    <option value="1">Part</option>
                </select>
            </div>
            <div>
                <p className='title'>Layout</p>
                <input id='overline-layout' type='checkbox' checked={displayEditStep === 1} onChange={handleDisplayEditStepChange} />
                <label htmlFor='overline-layout'>Outline a step when you mouse over it.</label>
            </div>
        </section>
    );
}

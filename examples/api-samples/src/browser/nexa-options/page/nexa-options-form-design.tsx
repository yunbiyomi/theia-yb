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
import { OptionsData, SELECT_TYPE } from '../nexa-options-definitions';
import NexaOptionsButton from '../component/nexa-options-button';
import NexaOptionsInput from '../component/nexa-options-input';

interface NexaOptionsFormDesignProps {
    optionsData: OptionsData;
    updateFormDesignOptions: (newData: any) => void;
    updateDisplayEditOptions: (newData: any) => void;
    optionsType: string;
    resetOptionsFile: (type: string) => void;
    saveOptionsData: () => void;
}

export default function NexaOptionsFormDesign(props: NexaOptionsFormDesignProps): React.JSX.Element {
    const data = props.optionsData.Configure.FormDesign;

    const initialFormDesignState = {
        undoMax: data.General.undoMax,
        defaultWidth: data.General.defaultWidth,
        defaultHeight: data.General.defaultHeight,
        selectType: data.General.selectType
    }

    const initialErrorState = {
        width: false,
        height: false
    }

    const initialMouseOver = {
        undo: false,
        width: false,
        height: false
    }

    const [formDesign, setFormDesign] = React.useState(initialFormDesignState);
    const [displayEditStep, setDisplayEditStep] = React.useState(data.LayoutManager.displayEditStep);

    const [error, setError] = React.useState(initialErrorState);
    const [mouseOver, setMouseOver] = React.useState(initialMouseOver);

    // 변경된 Options Data 저장
    React.useEffect(() => {
        props.updateFormDesignOptions(formDesign);
        props.updateDisplayEditOptions(displayEditStep);
    }, [formDesign, displayEditStep]);

    // width, height 유효성 검사
    React.useEffect(() => {
        const isMaxWidth: boolean = formDesign.defaultWidth > 12000 || formDesign.defaultWidth < 1;
        const isMaxHeight: boolean = formDesign.defaultHeight > 12000 || formDesign.defaultHeight < 1;

        setError(prev => ({
            ...prev,
            width: isMaxWidth,
            height: isMaxHeight
        }));

    }, [formDesign.defaultWidth, formDesign.defaultHeight]);

    // tooltip 표시 유무
    const handleMouseOver = (type: string, data: boolean) => {
        setMouseOver(prevData => ({
            ...prevData,
            [type]: data
        }));
    };

    // input 변경 내용 저장
    const handleInputChange = (type: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const parsedValue = value === '' ? 0 : parseInt(value);

        setFormDesign(prevData => ({
            ...prevData,
            [type]: parsedValue
        }));
    };

    const handleDisplayEditStepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDisplayEditStep = e.target.checked ? 1 : 0;
        setDisplayEditStep(newDisplayEditStep);
    };

    return (<>
        <section className='options-container'>
            <div className='design-basic-wrap options-wrap'>
                <p className='title'>Design Basic</p>
                <NexaOptionsInput
                    title={'Max Undo'}
                    value={formDesign.undoMax}
                    formDesignName={'undoMax'}
                    mouseOverName={'undo'}
                    mouseOverResult={mouseOver.undo}
                    tooltipMsg={'Maximum number of times you can recover to Undo'}
                    errorResult={undefined}
                    errorMsg={undefined}
                    handleMouseOver={handleMouseOver}
                    handleInputChange={handleInputChange}
                />
                <NexaOptionsInput
                    title={'Default Width (px)'}
                    value={formDesign.defaultWidth}
                    formDesignName={'defaultWidth'}
                    mouseOverName={'width'}
                    mouseOverResult={mouseOver.width}
                    tooltipMsg={'Set the default width when creating a new form'}
                    errorResult={error.width}
                    errorMsg={'Only up to 1~12000 can be entered'}
                    handleMouseOver={handleMouseOver}
                    handleInputChange={handleInputChange}
                />
                <NexaOptionsInput
                    title={'Default Height (px)'}
                    value={formDesign.defaultHeight}
                    formDesignName={'defaultHeight'}
                    mouseOverName={'height'}
                    mouseOverResult={mouseOver.height}
                    tooltipMsg={'Set the default height when creating a new form'}
                    errorResult={error.height}
                    errorMsg={'Only up to 1~12000 can be entered'}
                    handleMouseOver={handleMouseOver}
                    handleInputChange={handleInputChange}
                />
            </div>
            <div className='development-tools options-wrap'>
                <div className='select-type'>
                    <p className='title'>Select Type</p>
                    <div className='container' id='perspective'>
                        <div className='tabs'>
                            <input type='radio' id='radio-1' name='tabs-perspective' value={SELECT_TYPE.all} checked={formDesign.selectType === SELECT_TYPE.all} onChange={handleInputChange('selectType')} />
                            <label className='tab' htmlFor='radio-1'>All</label>
                            <input type='radio' id='radio-2' name='tabs-perspective' value={SELECT_TYPE.part} checked={formDesign.selectType === SELECT_TYPE.part} onChange={handleInputChange('selectType')} />
                            <label className='tab' htmlFor='radio-2'>Part</label>
                            <span className='glider1'></span>
                        </div>
                        {formDesign.selectType === SELECT_TYPE.all ?
                            <p className='select-type-content'>Options that are selected only when the selection includes the entire component.</p> :
                            <p className='select-type-content'>Options that are selected even if the selection includes some of the components.</p>
                        }
                    </div>
                </div>
                <div className={`ex-image select-type-imgae ${formDesign.selectType === SELECT_TYPE.all ? 'select-all' : 'select-part'}`} />
            </div>
            <div className='layout-wrap options-wrap'>
                <p className='title'>Layout</p>
                <label htmlFor='overline-layout' className='checkbox-container'>
                    <input id='overline-layout' className='custom-checkbox' type='checkbox' checked={displayEditStep === 1} onChange={handleDisplayEditStepChange} />
                    <span className='checkmark'></span>
                    Outline a step when you mouse over it.
                </label>
            </div>
        </section>
        <NexaOptionsButton
            optionsType={props.optionsType}
            resetOptionsFile={props.resetOptionsFile}
            saveOptionsData={props.saveOptionsData}
            result={error.width || error.height}
        />
    </>
    );
}

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

    const handleSelectTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            <div>
                <p>Design Basic</p>
                <div>
                    <p>Max Undo</p>
                    <input value={formDesign.undoMax} onChange={handleInputChange('maxUndo')} />
                </div>
                <div>
                    <p>Default Width</p>
                    <input value={formDesign.defaultWidth} onChange={handleInputChange('defaultWidth')} />
                </div>
                <div>
                    <p>Default Height</p>
                    <input value={formDesign.defaultHeight} onChange={handleInputChange('defaultHeight')} />
                </div>
            </div>
            <div>
                <p>Select Type</p>
                <div>
                    <label htmlFor='select-type-all'>Select All</label>
                    <input id='select-type-all' type='radio' name='check-select-type' value={0} checked={formDesign.selectType === 0} onChange={handleSelectTypeChange} />
                </div>
                <div>
                    <label htmlFor='select-type-part'>Select Part</label>
                    <input id='select-type-part' type='radio' name='check-select-type' value={1} checked={formDesign.selectType === 1} onChange={handleSelectTypeChange} />
                </div>
            </div>
            <div>
                <p>Layout</p>
                <input id='overline-layout' type='checkbox' checked={displayEditStep === 1} onChange={handleDisplayEditStepChange} />
                <label htmlFor='overline-layout'>Outline a step when you mouse over it.</label>
            </div>
        </section>
    );
}

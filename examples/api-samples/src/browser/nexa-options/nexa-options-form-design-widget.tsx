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

    const formDesign = {
        undoMax: formDesignData.undoMax,
        defaultWidth: formDesignData.defaultWidth,
        defaultHeight: formDesignData.defaultHeight,
        selectType: formDesignData.selectType,
        displayEditStep: data.LayoutManager.displayEditStep
    };

    const [selectType, setSelectType] = React.useState(formDesign.selectType);
    const [displayEditStep, setDisplayEditStep] = React.useState(formDesign.displayEditStep);

    React.useEffect(() => {
        if (formDesign.selectType === 0) {
            setSelectType(0);
        } else if (formDesign.selectType === 1) {
            setSelectType(1);
        }
    }, [formDesign.selectType]);

    const handleSelectTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectType(parseInt(e.target.value));
    };

    const handleDisplayEditStepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDisplayEditStep(e.target.checked ? 1 : 0);
    };

    return (
        <section className='form-design-options'>
            <div>
                <p>Design Basic</p>
                <div>
                    <p>Max Undo</p>
                    <input value={formDesign.undoMax} readOnly />
                </div>
                <div>
                    <p>Default Width</p>
                    <input value={formDesign.defaultWidth} readOnly />
                </div>
                <div>
                    <p>Default Height</p>
                    <input value={formDesign.defaultHeight} readOnly />
                </div>
            </div>
            <div>
                <p>Select Type</p>
                <div>
                    <label htmlFor='select-type-all'>Select All</label>
                    <input id='select-type-all' type='radio' name='check-select-type' value={0} checked={selectType === 0} onChange={handleSelectTypeChange} readOnly />
                </div>
                <div>
                    <label htmlFor='select-type-part'>Select Part</label>
                    <input id='select-type-part' type='radio' name='check-select-type' value={1} checked={selectType === 1} onChange={handleSelectTypeChange} readOnly />
                </div>
            </div>
            <div>
                <p>Layout</p>
                <input id='overline-layout' type='checkbox' checked={displayEditStep === 1} onChange={handleDisplayEditStepChange} readOnly />
                <label htmlFor='overline-layout'>Outline a step when you mouse over it.</label>
            </div>
        </section>
    );
}

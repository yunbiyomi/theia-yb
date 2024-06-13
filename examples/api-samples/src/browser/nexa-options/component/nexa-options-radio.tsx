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

interface NexaOptionsRadioProps {
    orderNumber: number;
    firstValue: string;
    firstContent: string;
    secValue: string;
    secContent: string;
    environmentType: string | number;
    setEnvironmentType: (value: React.SetStateAction<string>) => void;
    handleRadioChange: (type: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function NexaOptionsRadio(props: NexaOptionsRadioProps): React.JSX.Element {
    return (
        <div className='tabs'>
            <input
                type='radio'
                id={`radio-${props.orderNumber}`}
                name='tabs-perspective'
                value={props.firstValue}
                checked={props.environmentType === props.firstValue}
                onChange={() => props.setEnvironmentType(props.firstValue)}
            />
            <label className='tab' htmlFor={`radio-${props.orderNumber}`}>{props.firstContent}</label>
            <input
                type='radio'
                id={`radio-${props.orderNumber + 1}`}
                name='tabs-perspective'
                value={props.secValue}
                checked={props.environmentType === props.secValue}
                onChange={() => props.setEnvironmentType(props.secValue)}
            />
            <label className='tab' htmlFor={`radio-${props.orderNumber + 1}`}>{props.secContent}</label>
            <span id={`glider${props.orderNumber}`}></span>
        </div>
    )
}

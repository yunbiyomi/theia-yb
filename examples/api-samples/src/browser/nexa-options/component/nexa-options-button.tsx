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

interface NexaOptionsButtonProps {
    optionsType: string;
    resetOptionsFile: (type: string) => Promise<void>;
    saveOptionsData: () => Promise<void>;
}

export default function NexaOptionsButton(props: NexaOptionsButtonProps): React.JSX.Element {
    return (
        <div className='main-button-wrap'>
            <button className='options-button default' onClick={() => props.resetOptionsFile('all')}>Set default</button>
            <button className='options-button default' onClick={() => props.resetOptionsFile(props.optionsType)}>Set default current</button>
            <button className='options-button' onClick={props.saveOptionsData}>Save</button>
        </div>
    )
}

// *****************************************************************************
// Copyright (C) 2018 Ericsson and others.
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

import React = require('@theia/core/shared/react');
import HeaderComponent from './component/Header';
import AdditionalContainer from './component/Additional';
import AdvertisementContainer from './component/Advertisement';
import CurrentDesignContainer from './component/CurrentDesign';

export default function OpenStartWidgetComponent(): React.JSX.Element {

    return (
        <div className='widget-container'>
            <HeaderComponent />
            <AdditionalContainer />
            <AdvertisementContainer />
            <CurrentDesignContainer />
            <button className='chat-button'>
                ?
            </button>
        </div>
    );
}

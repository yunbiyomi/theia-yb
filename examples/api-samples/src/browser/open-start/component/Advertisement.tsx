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

export default function AdvertisementContainer(): React.JSX.Element {
    return (
        <section className='advertisement-container'>
            <div className='left-box'>
                <p className='advertisement-title'>The Eclipse Theia IDE</p>
                <p className='advertisement-content'>A modern and open IDE for cloud and desktop. The Theia IDE is based on the Theia platform.</p>
                <div className='advertisement-button-wrap'>
                    <button className='advertisement-button'>Download</button>
                    <button className='advertisement-button'>Try online</button>
                    <button className='advertisement-button'>View On  GitHub</button>
                </div>
                <p className='advertisement-content'>Please note that the Theia IDE is currently rebranded from its original name “Theia Blueprint”.</p>
            </div>
            <div className='right-box'>
                <div className='theia-image' />
            </div>
        </section>
    );
}

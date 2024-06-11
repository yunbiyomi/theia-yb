// *****************************************************************************
// Copyright (C) 2020 Ericsson and others.
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
import { FaFolder } from "react-icons/fa";
import { BsQuestionCircle } from "react-icons/bs";
interface NexaOptionsEnvironmentWidgetProps {
    optionsData: OptionsData;
    onFindClick: () => Promise<string | undefined>;
}

export default function NexaOptionsEnvironmentWidget(props: NexaOptionsEnvironmentWidgetProps): React.JSX.Element {
    const initialEnvironmentState = {
        workFolder: 'C://Users//tobesoft//Documents//tobesoft//nexacro N//settings',
        recentFileCount: 4,
        recentPrjCount: 4,
        commandType: 0,
        toolTheme: 0
    }
    const [environment] = React.useState(initialEnvironmentState);

    // React.useEffect(() => {
    //     if (props.optionsData.Configure) {
    //         const data = props.optionsData.Configure;

    //         const environmentData = {
    //             workFolder: data.Environment.General.workFolder,
    //             recentFileCount: data.Environment.General.recentFileCount,
    //             recentPrjCount: data.Environment.General.recentPrjCount,
    //             commandType: data.Environment.General.commandType,
    //             toolTheme: data.Environment.General.toolTheme
    //         }

    //         setEnvironment(environmentData);
    //     } else {
    //         return
    //     }
    // }, [props.optionsData]);

    return (
        <section className='options-container'>
            <div className='working-folder options-wrap'>
                <p className='title'>Working Folder</p>
                <div className='options-input-wrap'>
                    <div className='folder-wrap'>
                        <div className="textInputWrapper path">
                            <input placeholder="Project Count" value={environment.workFolder} className="textInput" readOnly />
                        </div>
                        <button className='find-button' >
                            <FaFolder size='1.2rem' color='#CCC' />
                        </button>
                    </div>
                </div>
            </div>
            <div className='recent-files options-wrap'>
                <p className='title'>Recent Files Count</p>
                <div className='options-input-wrap long'>
                    <div className='label-wrap'>
                        <p className='count-input-label'>File</p>
                        <button className='explanation-button' >
                            <BsQuestionCircle size='1rem' color='#CCC' />
                        </button>
                    </div>
                    <div className="textInputWrapper">
                        <input placeholder="File Count" value={environment.recentFileCount} className="textInput" />
                    </div>
                </div>
                <div className='options-input-wrap'>
                    <div className='label-wrap'>
                        <p className='count-input-label'>Folder</p>
                        <button className='explanation-button'>
                            <BsQuestionCircle size='1rem' color='#CCC' />
                        </button>
                    </div>
                    <div className="textInputWrapper">
                        <input placeholder="Project Count" value={environment.recentPrjCount} className="textInput" />
                    </div>
                </div>
            </div>
            <div className='development-tools options-wrap'>
                <p className='title'>Development Tools</p>
                <div className='container' id='perspective'>
                    <p className='input-label'>Perspective</p>
                    <div className='tabs'>
                        <input type="radio" id="radio-1" name="tabs-perspective" checked />
                        <label className="tab" htmlFor="radio-1">Developer</label>
                        <input type="radio" id="radio-2" name="tabs-perspective" />
                        <label className="tab" htmlFor="radio-2">Designer</label>
                        <span className="glider1"></span>
                    </div>
                </div>
                <div className='container' id='command'>
                    <p className='input-label'>Command Type</p>
                    <div className='tabs'>
                        <input type="radio" id="radio-3" name="tabs-command" checked />
                        <label className="tab" htmlFor="radio-3">Default</label>
                        <input type="radio" id="radio-4" name="tabs-command" />
                        <label className="tab" htmlFor="radio-4">Ribbon</label>
                        <span className="glider2"></span>
                    </div>
                </div>
                <div className='container' id='theme'>
                    <p className='input-label'>Nexacro Studio Theme</p>
                    <div className='tabs'>
                        <input type="radio" id="radio-5" name="tabs-theme" checked />
                        <label className="tab" htmlFor="radio-5">Default</label>
                        <input type="radio" id="radio-6" name="tabs-theme" />
                        <label className="tab" htmlFor="radio-6">Black</label>
                        <span className="glider3"></span>
                    </div>
                </div>
            </div>
            <div />
        </section>
    );
}

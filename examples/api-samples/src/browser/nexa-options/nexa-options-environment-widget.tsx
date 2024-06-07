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

interface NexaOptionsEnvironmentWidgetProps {
    optionsData: OptionsData;
    onFindClick: () => Promise<void>;
}

export default function NexaOptionsEnvironmentWidget(props: NexaOptionsEnvironmentWidgetProps): React.JSX.Element {
    const data = props.optionsData.Configure;
    const environmentData = data.Environment.General;
    const [environmentType, setEnvironmentType] = React.useState(data.setEnvironment);
    const [environment, setEnvironment] = React.useState({
        workFolder: environmentData.workFolder,
        recentFileCount: environmentData.recentFileCount,
        recentPrjCount: environmentData.recentPrjCount,
        commandType: environmentData.commandType,
        toolTheme: environmentData.toolTheme
    });

    React.useEffect(() => {
        props.optionsData.Configure.Environment.General = environment;
    }, [environment]);

    React.useEffect(() => {
        props.optionsData.Configure.setEnvironment = environmentType;
    }, [environmentType]);

    const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTheme = parseInt(e.target.value);
        setEnvironment(prevData => ({
            ...prevData,
            toolTheme: newTheme
        }))
    };

    const handleInputChange = (type: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        switch (type) {
            case 'workFolder':
                setEnvironment(prevData => ({
                    ...prevData,
                    workFolder: value
                }))
                break;
            case 'fileCount':
                setEnvironment(prevData => ({
                    ...prevData,
                    recentFileCount: parseInt(value)
                }))
                break;
            case 'prjCount':
                setEnvironment(prevData => ({
                    ...prevData,
                    recentPrjCount: parseInt(value)
                }))
                break;
            case 'setEnvironment':
                setEnvironmentType(value);
                break;
            case 'commandType':
                setEnvironment(prevData => ({
                    ...prevData,
                    commandType: parseInt(value)
                }))
                break;
        }
    }

    return (
        <section className='environment-options'>
            <div className='working-folder'>
                <p className='working-folder title'>Working Folder</p>
                <div className='options-input-wrap'>
                    <input className='options-input-wrap work' value={environment.workFolder} readOnly />
                    <button className='path-button' onClick={props.onFindClick}>find</button>
                </div>
            </div>
            <div className='recent-files'>
                <p className='recent-files title'>Recent Files</p>
                <div className='options-input-wrap long'>
                    <p className='input-label'>Number of recent files displayed in the list</p>
                    <input className='options-input' value={environment.recentFileCount} onChange={handleInputChange('fileCount')} />
                </div>
                <div className='options-input-wrap'>
                    <p className='input-label'>Number of recent Projects displayed in the list</p>
                    <input className='options-input' value={environment.recentPrjCount} onChange={handleInputChange('prjCount')} />
                </div>
            </div>
            <div className='development-tools'>
                <p className='development title'>Development Tools</p>
                <div className='options-input-wrap'>
                    <p className='input-label'>Perspective</p>
                    <input className='options-input' value={environmentType} onChange={handleInputChange('setEnvironment')} />
                </div>
                <div className='options-input-wrap'>
                    <p className='input-label'>Command Type</p>
                    <input className='options-input' value={environment.commandType} onChange={handleInputChange('commandType')} />
                </div>
                <div className='options-input-wrap'>
                    <p>Nexacro Studio Theme</p>
                    <div>
                        <label htmlFor='theme-default'>Default</label>
                        <input id='theme-default' type="radio" name="chk-theme" value={0} checked={environment.toolTheme === 0} onChange={handleThemeChange} readOnly />
                    </div>
                    <div>
                        <label htmlFor='theme-black'>Black</label>
                        <input id='theme-black' type="radio" name="chk-theme" value={1} checked={environment.toolTheme === 1} onChange={handleThemeChange} readOnly />
                    </div>
                </div>
            </div>
        </section>
    );
}

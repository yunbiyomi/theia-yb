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

import React, { useEffect } from '@theia/core/shared/react';
import { OptionsData } from '../../common/nexa-options/nexa-options-sevice';

interface NexaOptionsEnvironmentWidgetProps {
    optionsData: OptionsData;
    onFindClick: () => Promise<void>;
}

export default function NexaOptionsEnvironmentWidget(props: NexaOptionsEnvironmentWidgetProps): React.JSX.Element {
    const data = props.optionsData.Configure;
    const environmentData = data.Environment.General;
    const [prjError, setPrjError] = React.useState(false);
    const [fileError, setFileError] = React.useState(false);
    const [exImageType, setExImageType] = React.useState('developer-default');
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

    React.useEffect(() => {
        if (environmentType === 'developer') {
            if (environment.commandType === 0 && environment.toolTheme === 0) {
                setExImageType('developer-default');
            } else if (environment.commandType === 0 && environment.toolTheme === 1) {
                setExImageType('developer-black');
            } else if (environment.commandType === 1 && environment.toolTheme === 0) {
                setExImageType('ribbon-default');
            } else if (environment.commandType === 1 && environment.toolTheme === 1) {
                setExImageType('ribbon-black');
            }
        } else if (environmentType === 'designer') {
            if (environment.commandType === 0 && environment.toolTheme === 0) {
                setExImageType('designer-default');
            } else if (environment.commandType === 0 && environment.toolTheme === 1) {
                setExImageType('designer-black');
            } else if (environment.commandType === 1 && environment.toolTheme === 0) {
                setExImageType('ribbon-default');
            } else if (environment.commandType === 1 && environment.toolTheme === 1) {
                setExImageType('ribbon-black');
            }
        }
    }, [environment.commandType, environment.toolTheme, environmentType]);

    useEffect(() => {
        const isMaxFile = environment.recentFileCount > 16;

        isMaxFile ? setFileError(true) : setFileError(false);

    }, [environment.recentFileCount]);

    useEffect(() => {
        const isMaxPrj = environment.recentPrjCount > 16;

        isMaxPrj ? setPrjError(true) : setPrjError(false);

    }, [environment.recentPrjCount]);

    const handleSelectChange = (type: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;

        switch (type) {
            case 'environmentType':
                setEnvironmentType(e.target.value);
                break;
            case 'commandType':
                setEnvironment(prevData => ({
                    ...prevData,
                    commandType: parseInt(value)
                }));
                break;
            case 'theme':
                setEnvironment(prevData => ({
                    ...prevData,
                    toolTheme: parseInt(value)
                }));
                break;
        }
    };

    const handleInputChange = (type: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        switch (type) {
            case 'workFolder':
                setEnvironment(prevData => ({
                    ...prevData,
                    workFolder: value
                }));
                break;
            case 'fileCount':
                setEnvironment(prevData => ({
                    ...prevData,
                    recentFileCount: value === '' ? 0 : parseInt(value)
                }));
                break;
            case 'prjCount':
                setEnvironment(prevData => ({
                    ...prevData,
                    recentPrjCount: value === '' ? 0 : parseInt(value)
                }));
                break;
            case 'setEnvironment':
                setEnvironmentType(value);
                break;
        }
    };

    return (
        <section className='environment-options'>
            <div className='working-folder'>
                <p className='title'>Working Folder</p>
                <div className='options-input-wrap'>
                    <div className='folder-wrap'>
                        <input className='options-input' value={environment.workFolder} readOnly />
                        <button className='find-button' onClick={props.onFindClick}>find</button>
                    </div>
                </div>
            </div>
            <div className='recent-files'>
                <p className='title'>Recent Files</p>
                <div className='options-input-wrap long'>
                    {/* <p className='input-label'>File</p> */}
                    <p className='input-label'>Number of recent files displayed in the list</p>
                    <input className={`options-input ${fileError ? 'error-border' : ''}`} value={environment.recentFileCount} onChange={handleInputChange('fileCount')} />
                    {fileError && <span className='error-message'>Only up to 16 can be entered</span>}
                </div>
                <div className='options-input-wrap'>
                    {/* <p className='input-label'>Folder</p> */}
                    <p className='input-label'>Number of recent Projects displayed in the list</p>
                    <input className={`options-input ${prjError ? 'error-border' : ''}`} value={environment.recentPrjCount} onChange={handleInputChange('prjCount')} />
                    {prjError && <span className='error-message'>Only up to 16 can be entered</span>}
                </div>
            </div>
            <div className='development-tools'>
                <p className='development-title'>Development Tools</p>
                <div className='options-input-wrap'>
                    <p className='input-label'>Perspective</p>
                    <select className='select-input' value={environmentType} onChange={handleSelectChange('environmentType')}>
                        <option value="developer">Developer</option>
                        <option value="designer">Designer</option>
                    </select>
                </div>
                <div className='options-input-wrap'>
                    <p className='input-label'>Command Type</p>
                    <select className='select-input' value={environment.commandType} onChange={handleSelectChange('commandType')}>
                        <option value="0">Default</option>
                        <option value="1">Ribbon</option>
                    </select>
                </div>
                <div className='options-input-wrap'>
                    <p className='input-label'>Nexacro Studio Theme</p>
                    <select className='select-input' value={environment.toolTheme} onChange={handleSelectChange('theme')}>
                        <option value="0">Default</option>
                        <option value="1">Black</option>
                    </select>
                </div>
            </div>
            <div className={`ex-image ${exImageType}`}>
            </div>
        </section>
    );
}

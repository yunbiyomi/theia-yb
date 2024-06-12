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
import { FaFolder } from "react-icons/fa";
import { BsQuestionCircle } from "react-icons/bs";

interface NexaOptionsEnvironmentWidgetProps {
    optionsData: OptionsData;
    onFindClick: () => Promise<string | undefined>;
    updateEnvironmentOptions: (newData: any) => void;
    updateEnvironmentTypeOptions: (newData: any) => void;
}

export default function NexaOptionsEnvironmentWidget(props: NexaOptionsEnvironmentWidgetProps): React.JSX.Element {
    const data = props.optionsData?.Configure;

    const initialEnvironmentState = {
        workFolder: data?.Environment.General.workFolder,
        recentFileCount: data?.Environment.General.recentFileCount,
        recentPrjCount: data?.Environment.General.recentPrjCount,
        commandType: data?.Environment.General.commandType,
        toolTheme: data?.Environment.General.toolTheme
    }

    const [environment, setEnvironment] = React.useState(initialEnvironmentState);
    const [environmentType, setEnvironmentType] = React.useState(data.setEnvironment);
    const [exImageType, setExImageType] = React.useState('developer-default');
    const [prjError, setPrjError] = React.useState(false);
    const [fileError, setFileError] = React.useState(false);
    const [fileMouseOver, setFileMouseOver] = React.useState(false);
    const [prjMouseOver, setPrjMouseOver] = React.useState(false);
    const [perspectiveMouseOver, setPerspectiveMouseOver] = React.useState(false);
    const [commandMouseOver, setCommandMouseOver] = React.useState(false);
    const [themeMouseOver, setThemeMouseOver] = React.useState(false);

    const handleFindClick = async () => {
        console.log('click!');
        const originalPath = await props.onFindClick();
        if (originalPath) {
            const modifiedPath = originalPath.startsWith('/') ? originalPath.slice(1) : originalPath;
            setEnvironment(prevData => ({
                ...prevData,
                workFolder: modifiedPath
            }));
        }
    };

    React.useEffect(() => {
        props.updateEnvironmentOptions(environment);
    }, [environment]);

    React.useEffect(() => {
        props.updateEnvironmentTypeOptions(environmentType)
    }, [environmentType])

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

    React.useEffect(() => {
        const isMaxFile = environment.recentFileCount > 16;

        isMaxFile ? setFileError(true) : setFileError(false);

    }, [environment.recentFileCount]);

    React.useEffect(() => {
        const isMaxPrj = environment.recentPrjCount > 16;

        isMaxPrj ? setPrjError(true) : setPrjError(false);

    }, [environment.recentPrjCount]);

    const handleInputChange = (type: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        switch (type) {
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
        }
    };

    const handleRadioChange = (type: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
            case 'toolTheme':
                setEnvironment(prevData => ({
                    ...prevData,
                    toolTheme: parseInt(value)
                }));
                break;
        }
    };

    return <section className='options-container'>
        <div className='working-folder options-wrap'>
            <p className='title'>Working Folder</p>
            <div className='options-input-wrap'>
                <div className='folder-wrap'>
                    <div className="textInputWrapper path">
                        <input placeholder="Project Count" value={environment.workFolder} className="textInput" readOnly />
                    </div>
                    <button className='find-button' onClick={handleFindClick}>
                        <FaFolder size='1.2rem' color='#CCC' />
                    </button>
                </div>
            </div>
        </div>
        <div className='recent-files options-wrap'>
            <p className='title'>Recent Files Count</p>
            <div className='options-input-wrap'>
                <div className='label-wrap'>
                    <p className='count-input-label'>File</p>
                    <button className='explanation-button' onMouseOver={() => setFileMouseOver(true)} onMouseOut={() => setFileMouseOver(false)} >
                        <BsQuestionCircle size='1rem' color='#CCC' />
                        {fileMouseOver && (
                            <span className="tooltip">
                                <span className="text">
                                    Set the number of file lists that appear in the most recent list
                                </span>
                            </span>
                        )}
                    </button>
                </div>
                <div className={`textInputWrapper ${fileError && 'error-line'}`}>
                    <input placeholder="File Count" value={environment.recentFileCount} className="textInput" onChange={handleInputChange('fileCount')} />
                </div>
                {fileError && <span className='error-message'>Only up to 16 can be entered</span>}
            </div>
            <div className='options-input-wrap'>
                <div className='label-wrap'>
                    <p className='count-input-label'>Project</p>
                    <button className='explanation-button' onMouseOver={() => setPrjMouseOver(true)} onMouseOut={() => setPrjMouseOver(false)} >
                        <BsQuestionCircle size='1rem' color='#CCC' />
                        {prjMouseOver && (
                            <span className="tooltip">
                                <span className="text">
                                    Set the number of project lists that appear in the most recent list
                                </span>
                            </span>
                        )}
                    </button>
                </div>
                <div className={`textInputWrapper ${prjError && 'error-line'}`}>
                    <input placeholder="Project Count" value={environment.recentPrjCount} className="textInput" onChange={handleInputChange('prjCount')} />
                </div>
                {prjError && <span className='error-message'>Only up to 16 can be entered</span>}
            </div>
        </div>
        <div className='development-tools options-wrap'>
            <div className='development'>
                <p className='title'>Development Tools</p>
                <div className='container' id='perspective'>
                    <div className='label-wrap tabs-input'>
                        <p className='count-input-label'>Perspective</p>
                        <button className='explanation-button' onMouseOver={() => setPerspectiveMouseOver(true)} onMouseOut={() => setPerspectiveMouseOver(false)} >
                            <BsQuestionCircle size='1rem' color='#CCC' />
                            {perspectiveMouseOver && (
                                <span className="tooltip">
                                    <span className="text">
                                        Set the screen placement mode to use
                                    </span>
                                </span>
                            )}
                        </button>
                    </div>
                    <div className='tabs'>
                        <input type="radio" id="radio-1" name="tabs-perspective" value='developer' checked={environmentType === 'developer'} onChange={handleRadioChange('environmentType')} />
                        <label className="tab" htmlFor="radio-1">Developer</label>
                        <input type="radio" id="radio-2" name="tabs-perspective" value='designer' checked={environmentType === 'designer'} onChange={handleRadioChange('environmentType')} />
                        <label className="tab" htmlFor="radio-2">Designer</label>
                        <span className="glider1"></span>
                    </div>
                </div>
                <div className='container' id='command'>
                    <div className='label-wrap tabs-input'>
                        <p className='count-input-label'>Command Type</p>
                        <button className='explanation-button' onMouseOver={() => setCommandMouseOver(true)} onMouseOut={() => setCommandMouseOver(false)} >
                            <BsQuestionCircle size='1rem' color='#CCC' />
                            {commandMouseOver && (
                                <span className="tooltip">
                                    <span className="text">
                                        Set the menu type to use
                                    </span>
                                </span>
                            )}
                        </button>
                    </div>
                    <div className='tabs'>
                        <input type="radio" id="radio-3" name="tabs-command" value={0} checked={environment.commandType === 0} onChange={handleRadioChange('commandType')} />
                        <label className="tab" htmlFor="radio-3">Default</label>
                        <input type="radio" id="radio-4" name="tabs-command" value={1} checked={environment.commandType === 1} onChange={handleRadioChange('commandType')} />
                        <label className="tab" htmlFor="radio-4">Ribbon</label>
                        <span className="glider2"></span>
                    </div>
                </div>
                <div className='container' id='theme'>
                    <div className='label-wrap tabs-input'>
                        <p className='count-input-label'>Nexacro Studio Theme</p>
                        <button className='explanation-button' onMouseOver={() => setThemeMouseOver(true)} onMouseOut={() => setThemeMouseOver(false)} >
                            <BsQuestionCircle size='1rem' color='#CCC' />
                            {themeMouseOver && (
                                <span className="tooltip">
                                    <span className="text">
                                        Set theme with Nexacro Studio to use
                                    </span>
                                </span>
                            )}
                        </button>
                    </div>
                    <div className='tabs'>
                        <input type="radio" id="radio-5" name="tabs-theme" value={0} checked={environment.toolTheme === 0} onChange={handleRadioChange('toolTheme')} />
                        <label className="tab" htmlFor="radio-5">Default</label>
                        <input type="radio" id="radio-6" name="tabs-theme" value={1} checked={environment.toolTheme === 1} onChange={handleRadioChange('toolTheme')} />
                        <label className="tab" htmlFor="radio-6">Black</label>
                        <span className="glider3"></span>
                    </div>
                </div>
            </div>
            <div className={`ex-image ${exImageType}`} />
        </div>
        <div />
    </section>;
}

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
import { FaFolder } from "react-icons/fa";
import { BsQuestionCircle } from "react-icons/bs";
import { COMMAND_TYPE, OptionsData, TOOL_THEME } from './nexa-options-definitions';

interface NexaOptionsEnvironmentWidgetProps {
    optionsData: OptionsData;
    onFindClick: () => Promise<string | undefined>;
    updateEnvironmentOptions: (newData: any) => void;
    updateEnvironmentTypeOptions: (newData: any) => void;
}

export default function NexaOptionsEnvironmentWidget(props: NexaOptionsEnvironmentWidgetProps): React.JSX.Element {
    const data = props.optionsData?.Configure;

    const initialEnvironmentState = {
        workFolder: data.Environment.General.workFolder,
        recentFileCount: data.Environment.General.recentFileCount,
        recentPrjCount: data.Environment.General.recentPrjCount,
        commandType: data.Environment.General.commandType,
        toolTheme: data.Environment.General.toolTheme
    }

    const initialErrorState = {
        file: false,
        project: false
    }

    const initialMouseOver = {
        file: false,
        project: false,
        perspective: false,
        command: false,
        theme: false
    }

    const [environment, setEnvironment] = React.useState(initialEnvironmentState);
    const [environmentType, setEnvironmentType] = React.useState(data.setEnvironment);
    const [exImageType, setExImageType] = React.useState('developer-default');

    const [error, setError] = React.useState(initialErrorState);
    const [mouseOver, setMouseOver] = React.useState(initialMouseOver);

    // 프로젝트 저장할 폴더 저장
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

    // 변경된 Options Data 저장
    React.useEffect(() => {
        props.updateEnvironmentOptions(environment);
        props.updateEnvironmentTypeOptions(environmentType);
    }, [environment, environmentType]);

    // file, project 유효성 검사
    React.useEffect(() => {
        const isMaxFile: boolean = environment.recentFileCount > 16;
        const isMaxPrj: boolean = environment.recentPrjCount > 16;

        setError(prev => ({
            ...prev,
            file: isMaxFile,
            project: isMaxPrj
        }));

    }, [environment.recentFileCount, environment.recentPrjCount]);

    // tooltip 표시 유무
    const handleMouseOver = (type: string, data: boolean) => {
        setMouseOver(prevData => ({
            ...prevData,
            [type]: data
        }));
    };

    // 입력된 항목 저장
    const handleInputChange = (type: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const parsedValue = value === '' ? 0 : parseInt(value);

        setEnvironment(prevData => ({
            ...prevData,
            [type]: parsedValue
        }));
    };

    const handleRadioChange = (type: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const parsedValue = parseInt(value);

        setEnvironment(prevData => ({
            ...prevData,
            [type]: parsedValue
        }));
    };

    // 선택 내용 바탕으로 테마 이미지 표시
    React.useEffect(() => {
        const type = environment.commandType;
        const theme = environment.toolTheme;

        switch (environmentType) {
            case 'developer':
                if (type === COMMAND_TYPE.default) {
                    theme === TOOL_THEME.default ? setExImageType('developer-default') : setExImageType('developer-black');
                } else if (type === COMMAND_TYPE.ribbon) {
                    theme === TOOL_THEME.default ? setExImageType('ribbon-default') : setExImageType('ribbon-black');
                }
                break;
            case 'designer':
                if (type === COMMAND_TYPE.default) {
                    theme === TOOL_THEME.default ? setExImageType('designer-default') : setExImageType('designer-black');
                } else if (type === COMMAND_TYPE.ribbon) {
                    theme === TOOL_THEME.default ? setExImageType('ribbon-default') : setExImageType('ribbon-black');
                }
                break;
        }

    }, [environment.commandType, environment.toolTheme, environmentType]);

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
                    <button className='explanation-button' onMouseOver={() => handleMouseOver('file', true)} onMouseOut={() => handleMouseOver('file', false)} >
                        <BsQuestionCircle size='1rem' color='#CCC' />
                        {mouseOver.file && (
                            <span className="tooltip">
                                <span className="text">
                                    Set the number of file lists that appear in the most recent list
                                </span>
                            </span>
                        )}
                    </button>
                </div>
                <div className={`textInputWrapper ${error.file && 'error-line'}`}>
                    <input placeholder="File Count" value={environment.recentFileCount} className="textInput" onChange={handleInputChange('recentFileCount')} />
                </div>
                {error.file && <span className='error-message'>Only up to 16 can be entered</span>}
            </div>
            <div className='options-input-wrap'>
                <div className='label-wrap'>
                    <p className='count-input-label'>Project</p>
                    <button className='explanation-button' onMouseOver={() => handleMouseOver('project', true)} onMouseOut={() => handleMouseOver('project', false)} >
                        <BsQuestionCircle size='1rem' color='#CCC' />
                        {mouseOver.project && (
                            <span className="tooltip">
                                <span className="text">
                                    Set the number of project lists that appear in the most recent list
                                </span>
                            </span>
                        )}
                    </button>
                </div>
                <div className={`textInputWrapper ${error.project && 'error-line'}`}>
                    <input placeholder="Project Count" value={environment.recentPrjCount} className="textInput" onChange={handleInputChange('recentPrjCount')} />
                </div>
                {error.project && <span className='error-message'>Only up to 16 can be entered</span>}
            </div>
        </div>
        <div className='development-tools options-wrap'>
            <div className='development'>
                <p className='title'>Development Tools</p>
                <div className='container' id='perspective'>
                    <div className='label-wrap tabs-input'>
                        <p className='count-input-label'>Perspective</p>
                        <button className='explanation-button' onMouseOver={() => handleMouseOver('perspective', true)} onMouseOut={() => handleMouseOver('perspective', false)} >
                            <BsQuestionCircle size='1rem' color='#CCC' />
                            {mouseOver.perspective && (
                                <span className="tooltip">
                                    <span className="text">
                                        Set the screen placement mode to use
                                    </span>
                                </span>
                            )}
                        </button>
                    </div>
                    <div className='tabs'>
                        <input type="radio" id="radio-1" name="tabs-perspective" value='developer' checked={environmentType === 'developer'} onChange={() => setEnvironmentType('developer')} />
                        <label className="tab" htmlFor="radio-1">Developer</label>
                        <input type="radio" id="radio-2" name="tabs-perspective" value='designer' checked={environmentType === 'designer'} onChange={() => setEnvironmentType('designer')} />
                        <label className="tab" htmlFor="radio-2">Designer</label>
                        <span className="glider1"></span>
                    </div>
                </div>
                <div className='container' id='command'>
                    <div className='label-wrap tabs-input'>
                        <p className='count-input-label'>Command Type</p>
                        <button className='explanation-button' onMouseOver={() => handleMouseOver('command', true)} onMouseOut={() => handleMouseOver('command', false)} >
                            <BsQuestionCircle size='1rem' color='#CCC' />
                            {mouseOver.command && (
                                <span className="tooltip">
                                    <span className="text">
                                        Set the menu type to use
                                    </span>
                                </span>
                            )}
                        </button>
                    </div>
                    <div className='tabs'>
                        <input type="radio" id="radio-3" name="tabs-command" value={COMMAND_TYPE.default} checked={environment.commandType === COMMAND_TYPE.default} onChange={handleRadioChange('commandType')} />
                        <label className="tab" htmlFor="radio-3">Default</label>
                        <input type="radio" id="radio-4" name="tabs-command" value={COMMAND_TYPE.ribbon} checked={environment.commandType === COMMAND_TYPE.ribbon} onChange={handleRadioChange('commandType')} />
                        <label className="tab" htmlFor="radio-4">Ribbon</label>
                        <span className="glider2"></span>
                    </div>
                </div>
                <div className='container' id='theme'>
                    <div className='label-wrap tabs-input'>
                        <p className='count-input-label'>Nexacro Studio Theme</p>
                        <button className='explanation-button' onMouseOver={() => handleMouseOver('theme', true)} onMouseOut={() => handleMouseOver('theme', true)} >
                            <BsQuestionCircle size='1rem' color='#CCC' />
                            {mouseOver.theme && (
                                <span className="tooltip">
                                    <span className="text">
                                        Set theme with Nexacro Studio to use
                                    </span>
                                </span>
                            )}
                        </button>
                    </div>
                    <div className='tabs'>
                        <input type="radio" id="radio-5" name="tabs-theme" value={TOOL_THEME.default} checked={environment.toolTheme === TOOL_THEME.default} onChange={handleRadioChange('toolTheme')} />
                        <label className="tab" htmlFor="radio-5">Default</label>
                        <input type="radio" id="radio-6" name="tabs-theme" value={TOOL_THEME.black} checked={environment.toolTheme === TOOL_THEME.black} onChange={handleRadioChange('toolTheme')} />
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

import React from '@theia/core/shared/react';
import { OptionsData } from '../../common/nexa-options/nexa-options-sevice';
import { FaFolder } from "react-icons/fa";
import { BsQuestionCircle } from "react-icons/bs";

interface NexaOptionsEnvironmentWidgetProps {
    optionsData: OptionsData;
    onFindClick: () => Promise<string | undefined>;
}

export default function NexaOptionsEnvironmentWidget(props: NexaOptionsEnvironmentWidgetProps): React.JSX.Element {

    return (
        <section className='options-container'>
            <div className='working-folder'>
                <p className='title'>Working Folder</p>
                <div className='options-input-wrap'>
                    <div className='folder-wrap'>
                        <input className='options-input' readOnly />
                        <button className='find-button' >
                            <FaFolder size='1.2rem' />
                        </button>
                    </div>
                </div>
            </div>
            <div className='recent-files'>
                <p className='title'>Recent Files Count</p>
                <div className='options-input-wrap long'>
                    <div className='label-wrap'>
                        <p className='input-label'>File</p>
                        <button className='explanation-button'>
                            <BsQuestionCircle size='1rem' color='#CCC' />
                        </button>
                    </div>
                    <input />
                </div>
                <div className='options-input-wrap'>
                    <div className='label-wrap'>
                        <p className='input-label'>Folder</p>
                        <button className='explanation-button'>
                            <BsQuestionCircle size='1rem' color='#CCC' />
                        </button>
                    </div>
                    <input />
                </div>
            </div>
            <div className='development-tools'>
                <p className='development-title'>Development Tools</p>
                <div className='options-input-wrap'>
                    <p className='input-label'>Perspective</p>
                    <select className='select-input'>
                        <option value="developer">Developer</option>
                        <option value="designer">Designer</option>
                    </select>
                </div>
                <div className='options-input-wrap'>
                    <p className='input-label'>Command Type</p>
                    <select className='select-input'>
                        <option value="0">Default</option>
                        <option value="1">Ribbon</option>
                    </select>
                </div>
                <div className='options-input-wrap'>
                    <p className='input-label'>Nexacro Studio Theme</p>
                    <select className='select-input' >
                        <option value="0">Default</option>
                        <option value="1">Black</option>
                    </select>
                </div>
            </div>
            <div />
        </section>
    );
}

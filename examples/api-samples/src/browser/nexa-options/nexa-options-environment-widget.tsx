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
}

export default function NexaOptionsEnvironmentWidget(props: NexaOptionsEnvironmentWidgetProps): React.JSX.Element {
    const data = props.optionsData.Configure;
    const environmentData = data.Environment.General;
    const environment = {
        workFolder: environmentData.workFolder,
        recentFileCount: environmentData.recentFileCount,
        recnetPrjCount: environmentData.recentPrjCount,
        setEnvironment: data.setEnvironment,
        commandType: environmentData.commandType,
        toolTheme: environmentData.toolTheme
    };

    const [theme, setTheme] = React.useState(environment.toolTheme);

    React.useEffect(() => {
        if (environment.toolTheme === 0) {
            setTheme(0);
        } else if (environment.toolTheme === 1) {
            setTheme(1);
        }
    }, [environment.toolTheme]);

    const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTheme = parseInt(e.target.value);
        setTheme(newTheme);
    };

    return (
        <section className='environment-options'>
            <div className='working-folder'>
                <p className='working-folder-title'>Working Folder</p>
                <input value={environment.workFolder} readOnly />
                <button>find</button>
            </div>
            <div className='recent-files'>
                <p className='recent-files-title'>Recent Files</p>
                <div>
                    <p>Number of recent files displayed in the list</p>
                    <input value={environment.recentFileCount} readOnly />
                </div>
                <div>
                    <p>Number of recent Projects displayed in the list</p>
                    <input value={environment.recnetPrjCount} readOnly />
                </div>
            </div>
            <div className='development-tools'>
                <p className='development-title'>Development Tools</p>
                <div>
                    <p>Perspective</p>
                    <input value={environment.setEnvironment} readOnly />
                </div>
                <div>
                    <p>Command Type</p>
                    <input value={environment.commandType} readOnly />
                </div>
                <div>
                    <p>Nexacro Studio Theme</p>
                    <div>
                        <label htmlFor='theme-default'>Default</label>
                        <input id='theme-default' type="radio" name="chk-theme" value={0} checked={theme === 0} onChange={handleThemeChange} readOnly />
                    </div>
                    <div>
                        <label htmlFor='theme-black'>Black</label>
                        <input id='theme-black' type="radio" name="chk-theme" value={1} checked={theme === 1} onChange={handleThemeChange} readOnly />
                    </div>
                </div>
            </div>
        </section>
    );
}

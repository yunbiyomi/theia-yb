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

import * as React from '@theia/core/shared/react';
import { nls } from '@theia/core';
import { injectable, postConstruct } from '@theia/core/shared/inversify';
import { ReactWidget } from '@theia/core/lib/browser';
import HeaderComponent from './component/Header';
import AdditionalContainer from './component/Additional';
import AdvertisementContainer from './component/Advertisement';
import CurrentDesignContainer from './component/CurrentDesign';

@injectable()
export class OpenStartWidget extends ReactWidget {

    static readonly ID = 'open-start-widget';
    static readonly LABEL = nls.localizeByDefault('Open');

    // 클래스 초기화
    @postConstruct()
    protected init(): void {
        this.doInit();
    }

    protected async doInit(): Promise<void> {
        this.id = OpenStartWidget.ID;
        this.title.label = OpenStartWidget.LABEL;
        this.title.caption = OpenStartWidget.LABEL;
        this.title.closable = true;
        this.update();
    }

    // 위젯 렌더링
    protected render(): React.ReactNode {
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

}

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
import { BiSearch, BiSolidVideoPlus } from "react-icons/bi";
import { HiSparkles } from "react-icons/hi";
import { SiGoogledocs } from "react-icons/si";
import { PiChalkboardFill } from "react-icons/pi";
import { HiMiniPresentationChartLine } from "react-icons/hi2";
import { BsChatSquareHeartFill } from "react-icons/bs";
import { MdOutlineWebAsset } from "react-icons/md";
import { IoIosMore } from "react-icons/io";

export default function HeaderComponent(): React.JSX.Element {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    return (
        <section className='header-box'>
            <h2 className='header-content'>오늘은 어떤 코드를 작성해볼까요?</h2>
            <div className='title-button-wrap'>
                <button className='title-button'>맞춤형 크기</button>
                <button className='title-button'>업로드</button>
            </div>
            <div className="input-wrap">
                <div className='search-icon' onClick={() => inputRef.current?.focus()}>
                    <BiSearch size='1.5rem' color='black' />
                </div>
                <input ref={inputRef} className='search-input' type="text" placeholder='내 콘텐츠 또는 Theia 콘텐츠 검색' />
            </div>
            <div className="button-wrap">
                <div className="button-content">
                    <button className='menu-button customized-button'>
                        <HiSparkles size='1.7rem' color='#2d3cae' />
                    </button>
                    <p className='menu-name'>맞춤형</p>
                </div>
                <div className="button-content">
                    <button className='menu-button'>
                        <SiGoogledocs size='1.7rem' color='#01c4cd' />
                    </button>
                    <p className='menu-name'>Docs</p>
                </div>
                <div className="button-content">
                    <button className='menu-button'>
                        <PiChalkboardFill size='2rem' color='#21a663' />
                    </button>
                    <p className='menu-name'>화이트보드</p>
                </div>
                <div className="button-content">
                    <button className='menu-button'>
                        <HiMiniPresentationChartLine size='2rem' color='#ff9900' />
                    </button>
                    <p className='menu-name'>프레젠테이션</p>
                </div>
                <div className="button-content">
                    <button className='menu-button'>
                        <BsChatSquareHeartFill size='1.5rem' color='#ff5154' />
                    </button>
                    <p className='menu-name'>소셜 미디어</p>
                </div>
                <div className="button-content">
                    <button className='menu-button'>
                        <BiSolidVideoPlus size='2rem' color='#d269e6' />
                    </button>
                    <p className='menu-name'>동영상</p>
                </div>
                <div className="button-content">
                    <button className='menu-button'>
                        <MdOutlineWebAsset size='2rem' color='#575efd' />
                    </button>
                    <p className='menu-name'>웹사이트</p>
                </div>
                <div className="button-content">
                    <button className='menu-button'>
                        <IoIosMore size='2rem' color='#a570ff' />
                    </button>
                    <p className='menu-name'>더보기</p>
                </div>
            </div>
        </section>
    );
}

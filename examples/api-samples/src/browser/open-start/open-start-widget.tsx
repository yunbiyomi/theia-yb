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
import { BiSearch, BiSolidVideoPlus } from "react-icons/bi";
import { HiSparkles } from "react-icons/hi";
import { SiGoogledocs } from "react-icons/si";
import { PiChalkboardFill } from "react-icons/pi";
import { HiMiniPresentationChartLine } from "react-icons/hi2";
import { BsChatSquareHeartFill } from "react-icons/bs";
import { MdOutlineWebAsset } from "react-icons/md";
import { IoIosMore } from "react-icons/io";
import { AiOutlineUnorderedList } from "react-icons/ai";

@injectable()
export class OpenStartWidget extends ReactWidget {

    static readonly ID = 'open.start.widget';
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
        // const [isViewList, setIsViewList] = React.useState(false);

        // const handleViewType = () => {
        //     setIsViewList(!isViewList);
        // }

        return <div className='widget-container'>
            <section className='header-box'>
                <h2 className='header-content'>오늘은 어떤 코드를 작성해볼까요?</h2>
                <div className='title-button-wrap'>
                    <button className='title-button'>맞춤형 크기</button>
                    <button className='title-button'>업로드</button>
                </div>
                <div className="input-wrap">
                    <div className='search-icon'>
                        <BiSearch size='1.5rem' color='black' />
                    </div>
                    <input className='search-input' type="text" placeholder='내 콘텐츠 또는 Theia 콘텐츠 검색' />
                </div>
                <div className="button-wrap">
                    <div className="button-content">
                        <button className='menu-button'>
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
            <section className='additional-items'>
                <h3 className='sub-title'>추천 항목</h3>
                <ul className='items-list'>
                    <li className='item'>
                        <div className='item-image docs' />
                        <p className='item-name'>Docs</p>
                    </li>
                    <li className='item'>
                        <div className='item-image whiteboard' />
                        <p className='item-name'>화이트보드</p>
                    </li>
                    <li className='item'>
                        <div className='item-image presentation' />
                        <p className='item-name'>프레젠테이션(16:9)</p>
                    </li>
                    <li className='item'>
                        <div className='item-image video' />
                        <p className='item-name'>동영상</p>
                    </li>
                    <li className='item'>
                        <div className='item-image instagram' />
                        <p className='item-name'>인스타그램 게시물</p>
                    </li>
                    <li className='item'>
                        <div className='item-image poster' />
                        <p className='item-name'>포스터(세로)</p>
                    </li>
                    <li className='item'>
                        <div className='item-image leaflet' />
                        <p className='item-name'>전단지(A4)</p>
                    </li>
                    <li className='item'>
                        <div className='item-image worksheet' />
                        <p className='item-name'>워크시트(A4 세로형)</p>
                    </li>
                    <li className='item'>
                        <div className='item-image logo' />
                        <p className='item-name'>로고</p>
                    </li>
                    <li className='item'>
                        <div className='item-image document' />
                        <p className='item-name'>문서</p>
                    </li>
                    <li className='item'>
                        <div className='item-image youtube' />
                        <p className='item-name'>YouTube 썸네일</p>
                    </li>
                    <li className='item'>
                        <div className='item-image story' />
                        <p className='item-name'>스토리</p>
                    </li>
                </ul>
            </section>
            <section className='current-design'>
                <div className='title-wrap'>
                    <h3 className='sub-title'>최근 디자인</h3>
                    <button className='change-view-type-button'>
                        <AiOutlineUnorderedList size='1.5rem' color='#CCC' />
                        {/* {
                            isViewList === false ?
                                <AiOutlineUnorderedList size='1rem' color='white' /> :
                                <BsGrid size='1rem' color='white' />
                        } */}
                    </button>
                </div>
                <ul className='items-list'>
                    <li className='item'>
                        <div className='item-image no-image' />
                        <p className='item-name'>제목 없는 디자인</p>
                        <p className='design-type'>스토리</p>
                    </li>
                    <li className='item'>
                        <div className='item-image no-image' />
                        <p className='item-name'>제목 없는 디자인</p>
                        <p className='design-type'>Docs</p>
                    </li>
                    <li className='item'>
                        <div className='item-image no-image' />
                        <p className='item-name'>제목 없는 디자인</p>
                        <p className='design-type'>Docs</p>
                    </li>
                    <li className='item'>
                        <div className='item-image no-image' />
                        <p className='item-name'>제목 없는 디자인</p>
                        <p className='design-type'>스토리</p>
                    </li>
                    <li className='item'>
                        <div className='item-image no-image' />
                        <p className='item-name'>제목 없는 디자인</p>
                        <p className='design-type'>프레젠테이션</p>
                    </li>
                    <li className='item'>
                        <div className='item-image no-image' />
                        <p className='item-name'>제목 없는 디자인</p>
                        <p className='design-type'>로고</p>
                    </li>
                </ul>
            </section>
        </div>
    }

}

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
import { BsChatSquareHeartFill, BsSearch, BsGrid, BsPeople } from "react-icons/bs";
import { MdOutlineWebAsset } from "react-icons/md";
import { IoIosMore } from "react-icons/io";
import { AiOutlineUnorderedList } from "react-icons/ai";

export default function OpenStartWidgetComponent(): React.JSX.Element {
    const [isViewList, setIsViewList] = React.useState(false);
    const [isMouseHover, setIsMouseHover] = React.useState(false);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const itemsRef = React.useRef<HTMLUListElement>(null);

    // 최근 디자인 보기 type 저장
    const handleViewType = () => {
        setIsViewList(!isViewList);
    }

    // change-view-type-button hover 여부
    const handleMouseOver = () => {
        setIsMouseHover(true);
    }

    const handleMouseOut = () => {
        setIsMouseHover(false);
    }

    // 추천 항목 hover시 돋보기 버튼 생성
    const hoverAdditionalItem = () => {
        return (
            <>
                <button className='additional-hover-button'>
                    <BsSearch size='1rem' color='black' />
                </button>
            </>
        )
    }

    // 최근 디자인 hover시 버튼들 생성
    const hoverCurrentDesign = () => {
        return (
            <div className='hover-button-wrap'>
                <button className='design-hover-button'>
                    <BsPeople size='1rem' color='black' />
                </button>
                <button className='design-hover-button'>
                    <IoIosMore size='1rem' color='black' />
                </button>
            </div>
        )
    }

    // 추천 항목 슬라이더
    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const nextSlide = () => {
        if (itemsRef.current) {
            const numItems = itemsRef.current.childNodes.length;
            const maxIndex = Math.max(0, numItems - 5);
            if (currentIndex < maxIndex) {
                setCurrentIndex(currentIndex + 1);
            }
        }
    };

    // Header
    const HeaderContainer = () => {
        return (
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
        )
    }

    // 추천 항목
    const AdditionalContainer = () => {
        return (
            <section className='additional-items'>
                <h3 className='sub-title'>추천 항목</h3>
                <div className='slider-container'>
                    <button className='slider-button prev-button' onClick={prevSlide}>◀</button>
                    <ul ref={itemsRef} className='items' style={{ transform: `translateX(-${currentIndex * 12}rem)` }}>
                        <li className='additional-item'>
                            {hoverAdditionalItem()}
                            <div className='additional-item-image docs' />
                            <p className='additional-item-name'>Docs</p>
                            <p className='size-content'>자동크기</p>
                        </li>
                        <li className='additional-item'>
                            {hoverAdditionalItem()}
                            <div className='additional-item-image whiteboard' />
                            <p className='additional-item-name'>화이트보드</p>
                            <p className='size-content'>무제한</p>
                        </li>
                        <li className='additional-item'>
                            {hoverAdditionalItem()}
                            <div className='additional-item-image presentation' />
                            <p className='additional-item-name'>프레젠테이션(16:9)</p>
                            <p className='size-content'>1920 x 1080px</p>
                        </li>
                        <li className='additional-item'>
                            {hoverAdditionalItem()}
                            <div className='additional-item-image video' />
                            <p className='additional-item-name'>동영상</p>
                            <p className='size-content'>1920 x 1080px</p>
                        </li>
                        <li className='additional-item'>
                            {hoverAdditionalItem()}
                            <div className='additional-item-image instagram' />
                            <p className='additional-item-name'>인스타그램 게시물</p>
                            <p className='size-content'>1080 x 1080px</p>
                        </li>
                        <li className='additional-item'>
                            {hoverAdditionalItem()}
                            <div className='additional-item-image poster' />
                            <p className='additional-item-name'>포스터(세로)</p>
                            <p className='size-content'>42 x 59.4px</p>
                        </li>
                        <li className='additional-item'>
                            {hoverAdditionalItem()}
                            <div className='additional-item-image leaflet' />
                            <p className='additional-item-name'>전단지(A4)</p>
                            <p className='size-content'>210 x 297px</p>
                        </li>
                        <li className='additional-item'>
                            {hoverAdditionalItem()}
                            <div className='additional-item-image worksheet' />
                            <p className='additional-item-name'>워크시트(A4 세로형)</p>
                            <p className='size-content'>21 x 29.7px</p>
                        </li>
                        <li className='additional-item'>
                            {hoverAdditionalItem()}
                            <div className='additional-item-image logo' />
                            <p className='additional-item-name'>로고</p>
                            <p className='size-content'>500 x 500px</p>
                        </li>
                        <li className='additional-item'>
                            {hoverAdditionalItem()}
                            <div className='additional-item-image document' />
                            <p className='additional-item-name'>문서</p>
                            <p className='size-content'>자동크기</p>
                        </li>
                        <li className='additional-item'>
                            {hoverAdditionalItem()}
                            <div className='additional-item-image youtube' />
                            <p className='additional-item-name'>YouTube 썸네일</p>
                            <p className='size-content'>1280 x 720px</p>
                        </li>
                        <li className='additional-item'>
                            {hoverAdditionalItem()}
                            <div className='additional-item-image story' />
                            <p className='additional-item-name'>스토리</p>
                            <p className='size-content'>1080 x 1920px</p>
                        </li>
                    </ul>
                    <button className='slider-button next-button' onClick={nextSlide}>▶</button>
                </div>
            </section>
        );
    }

    // 광고
    const AdvertisementContainer = () => {
        return (
            <section className='advertisement-container'>
                <div className='left-box'>
                    <p className='advertisement-title'>The Eclipse Theia IDE</p>
                    <p className='advertisement-content'>A modern and open IDE for cloud and desktop. The Theia IDE is based on the Theia platform.</p>
                    <div className='advertisement-button-wrap'>
                        <button className='advertisement-button'>Download</button>
                        <button className='advertisement-button'>Try online</button>
                        <button className='advertisement-button'>View On  GitHub</button>
                    </div>
                    <p className='advertisement-content'>Please note that the Theia IDE is currently rebranded from its original name “Theia Blueprint”.</p>
                </div>
                <div className='right-box'>
                    <div className='theia-image' />
                </div>
            </section>
        );
    }

    // 최근 디자인
    const CurrentDesignContainer = () => {
        return (
            <section className='current-design'>
                <div className='title-wrap'>
                    <h3 className='sub-title'>최근 디자인</h3>
                    <div className='type-container'>
                        <button
                            className='change-view-type-button'
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                            onClick={handleViewType}>
                            {
                                isViewList === false
                                    ? <AiOutlineUnorderedList size='1.5rem' color='#CCC' />
                                    : <BsGrid size='1rem' color='#CCC' />
                            }
                        </button>
                        {
                            isViewList === false
                                ? <div className='type-tip-box' style={{ opacity: `${isMouseHover ? 1 : 0}` }}>목록으로 보기</div>
                                : <div className='type-tip-box' style={{ opacity: `${isMouseHover ? 1 : 0}` }}>그리드로 보기</div>
                        }
                    </div>
                </div>
                {
                    isViewList === false ?
                        // Grid
                        <ul className='items'>
                            <li className='design-item'>
                                {hoverCurrentDesign()}
                                <div className='design-item-image no-image' />
                                <p className='design-item-name'>제목 없는 디자인</p>
                                <p className='design-type'>스토리</p>
                            </li>
                            <li className='design-item'>
                                {hoverCurrentDesign()}
                                <div className='design-item-image no-image' />
                                <p className='design-item-name'>제목 없는 디자인</p>
                                <p className='design-type'>Docs</p>
                            </li>
                            <li className='design-item'>
                                {hoverCurrentDesign()}
                                <div className='design-item-image no-image' />
                                <p className='design-item-name'>제목 없는 디자인</p>
                                <p className='design-type'>스토리</p>
                            </li>
                            <li className='design-item'>
                                {hoverCurrentDesign()}
                                <div className='design-item-image no-image' />
                                <p className='design-item-name'>제목 없는 디자인</p>
                                <p className='design-type'>프레젠테이션</p>
                            </li>
                            <li className='design-item'>
                                {hoverCurrentDesign()}
                                <div className='design-item-image no-image' />
                                <p className='design-item-name'>제목 없는 디자인</p>
                                <p className='design-type'>로고</p>
                            </li>
                        </ul> :
                        // List
                        <ul className='items-list'>
                            <li className='design-item-list'>
                                <div className='design-item-image-list no-image' />
                                <p className='design-item-name-list'>제목 없는 디자인</p>
                                <p className='design-type-list'>--</p>
                                <p className='design-type-list'>스토리</p>
                                <p className='design-type-list'>3시간 전</p>
                                <button className='more-button'>
                                    <IoIosMore size='1rem' color='#CCC' />
                                </button>
                            </li>
                            <li className='design-item-list'>
                                <div className='design-item-image-list no-image' />
                                <p className='design-item-name-list'>제목 없는 디자인</p>
                                <p className='design-type-list'>--</p>
                                <p className='design-type-list'>Docs</p>
                                <p className='design-type-list'>5시간 전</p>
                                <button className='more-button'>
                                    <IoIosMore size='1rem' color='#CCC' />
                                </button>
                            </li>
                            <li className='design-item-list'>
                                <div className='design-item-image-list no-image' />
                                <p className='design-item-name-list'>제목 없는 디자인</p>
                                <p className='design-type-list'>--</p>
                                <p className='design-type-list'>스토리</p>
                                <p className='design-type-list'>13시간 전</p>
                                <button className='more-button'>
                                    <IoIosMore size='1rem' color='#CCC' />
                                </button>
                            </li>
                            <li className='design-item-list'>
                                <div className='design-item-image-list no-image' />
                                <p className='design-item-name-list'>제목 없는 디자인</p>
                                <p className='design-type-list'>--</p>
                                <p className='design-type-list'>프레젠테이션</p>
                                <p className='design-type-list'>17시간 전</p>
                                <button className='more-button'>
                                    <IoIosMore size='1rem' color='#CCC' />
                                </button>
                            </li>
                            <li className='design-item-list'>
                                <div className='design-item-image-list no-image' />
                                <p className='design-item-name-list'>제목 없는 디자인</p>
                                <p className='design-type-list'>--</p>
                                <p className='design-type-list'>로고</p>
                                <p className='design-type-list'>22시간 전</p>
                                <button className='more-button'>
                                    <IoIosMore size='1rem' color='#CCC' />
                                </button>
                            </li>
                        </ul>
                }
            </section>
        );
    }

    return (
        <div className='widget-container'>
            {HeaderContainer()}
            {AdditionalContainer()}
            {AdvertisementContainer()}
            {CurrentDesignContainer()}
            <button className='chat-button'>
                ?
            </button>
        </div>
    );
}

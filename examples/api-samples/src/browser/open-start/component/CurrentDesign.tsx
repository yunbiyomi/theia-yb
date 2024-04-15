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
import { BsGrid, BsPeople } from "react-icons/bs";
import { IoIosMore } from "react-icons/io";
import { AiOutlineUnorderedList } from "react-icons/ai";

export default function CurrentDesignContainer(): React.JSX.Element {
    const [isViewList, setIsViewList] = React.useState(false);
    const [isMouseHover, setIsMouseHover] = React.useState(false);

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

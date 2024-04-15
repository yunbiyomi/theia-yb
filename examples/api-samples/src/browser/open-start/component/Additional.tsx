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
import { BsSearch } from "react-icons/bs";

export default function AdditionalContainer(): React.JSX.Element {
    const [slidePosition, setSlidePosition] = React.useState(0);
    const sliderRef = React.useRef<HTMLDivElement | null>(null);

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

    // 추천 항목 슬라이더
    React.useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.scrollTo({
                left: slidePosition,
                behavior: 'smooth'
            });
        }
    }, [slidePosition])

    // prev event
    const handlePrevSlide = () => {
        if (slidePosition === 0) return;
        if (sliderRef.current) {
            const newSlidePosition = slidePosition - sliderRef.current.clientWidth;
            setSlidePosition(newSlidePosition);
        }
    };

    // next event
    const handleNextSlide = () => {
        if (sliderRef.current) {
            const maxSlidePosition = sliderRef.current.scrollWidth - sliderRef.current.clientWidth;
            if (slidePosition >= maxSlidePosition) return;
            const newSlidePosition = slidePosition + sliderRef.current.clientWidth;
            setSlidePosition(newSlidePosition);
        }
    };

    // 마지막 slide 도달 시 disable 여부 확인
    const chekLastSlide = () => {
        if (sliderRef.current) {
            const maxSlidePosition = sliderRef.current.scrollWidth - sliderRef.current.clientWidth;
            return slidePosition >= maxSlidePosition ? true : false;
        }
    }

    return (
        <section className='additional-items'>
            <h3 className='sub-title'>추천 항목</h3>
            <div ref={sliderRef} className='slider-container'>
                <button className='slider-button prev-button' disabled={slidePosition === 0 ? true : false} onClick={handlePrevSlide}>◀</button>
                <ul className='items'>
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
                </ul>
                <button className='slider-button next-button' disabled={chekLastSlide()} onClick={handleNextSlide}>▶</button>
            </div>
        </section>
    );
} 

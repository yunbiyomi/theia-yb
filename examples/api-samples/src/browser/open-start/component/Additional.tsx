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
import AdditionalData from '../data/additionalData.json';

export default function AdditionalContainer(): React.JSX.Element {
    interface Item {
        imageUrl: string;
        className: string;
        name: string;
        size: string;
    }
    const [slidePosition, setSlidePosition] = React.useState(0);
    const sliderRef = React.useRef<HTMLDivElement | null>(null);
    const items: Item[] = JSON.parse(JSON.stringify(AdditionalData));

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
                    {items.map((item, index) => (
                        <li key={index} className='additional-item'>
                            {hoverAdditionalItem()}
                            <div className={`additional-item-image ${item.className}`} />
                            <p className='additional-item-name'>{item.name}</p>
                            <p className='size-content'>{item.size}</p>
                        </li>
                    ))}
                </ul>
                <button className='slider-button next-button' disabled={chekLastSlide()} onClick={handleNextSlide}>▶</button>
            </div>
        </section>
    );
} 

import Link from 'next/link'
import React from 'react'
import { CarouselItem } from '../types/misc'
import Image from 'next/image'
import styles from '../styles/components/ProductCard.module.css'
import { useWindowSize } from '../hooks/useWindowSize'
import { border } from '@mui/system'
import { Colors } from '../utils/Colors'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper'
import 'swiper/css/bundle'
import 'swiper/css'
import 'swiper/css/pagination'
import { Constants } from '../utils/Constants'

const GUTTERS = 50
const SHRINK_CONSTANT = 0.15

interface Props {
    items: CarouselItem[]
    activeIndex: number
    setActiveIndex: (index: number) => void
    width?: number
}

export const Carousel = ({ activeIndex, items, setActiveIndex, width }: Props) => {
    const certainWidth = width || Constants.screenWidthsm
    const activeItem: CarouselItem | undefined = ({} = items[activeIndex])
    const thumbSize = Math.max(certainWidth * SHRINK_CONSTANT, 70)
    const activeImageSize = Math.min(certainWidth - GUTTERS, 300)
    return (
        <div style={{ width: certainWidth }}>
            {!!activeItem ? (
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        src={activeItem?.imgURL}
                        width={activeImageSize}
                        height={activeImageSize}
                        alt="Product Image"
                        style={{
                            borderRadius: 10,
                            marginTop: 10,
                            marginBottom: 10,
                        }}
                        className={styles.cardImg}
                        data-lightboxjs="lightbox1"
                    />
                </div>
            ) : (
                <div style={{ height: activeImageSize }} />
            )}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Swiper
                    modules={[Pagination]}
                    slidesPerView={determineSlidesPerView(certainWidth)}
                    pagination={{
                        clickable: true,
                    }}
                    style={{
                        height: 110,
                        width: '100%',
                    }}
                >
                    {items.map((item, i) => (
                        <SwiperSlide style={{ display: 'flex', justifyContent: 'center' }} key={item.id}>
                            <Image
                                key={item.id}
                                src={item.imgURL}
                                width={thumbSize}
                                height={thumbSize}
                                alt="Product Image"
                                style={{
                                    borderRadius: 20,
                                    opacity: i === activeIndex ? 0.5 : 1,
                                    border: `2px solid ${i === activeIndex ? Colors.darkest : Colors.light}`,
                                    cursor: 'pointer',
                                }}
                                onClick={() => setActiveIndex(i)}
                                draggable={false}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}

const determineSlidesPerView = (width: number) => {
    if (width < 350) {
        return 3
    } else if (width < 450) {
        return 4
    } else {
        return 5
    }
}

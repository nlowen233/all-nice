import React from 'react'
import { LoadState } from '../types/misc'
import { LoaderWrapper } from './LoaderWrapper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper'
import 'swiper/css/bundle'
import 'swiper/css'
import 'swiper/css/pagination'
import { Typography } from '@mui/material'
import { Colors } from '../utils/Colors'

type Props = {
    cards: JSX.Element[]
    loadState: LoadState
    pageLimit?: number
    slidesPerView?: number
    emptyMessage?: string
}

export const CardList = ({ cards, loadState, pageLimit, slidesPerView, emptyMessage }: Props) => {
    const pagnatedCards = pagniateCards(cards, pageLimit || 6)
    return (
        <LoaderWrapper loadState={loadState} items={cards}>
            <Swiper
                modules={[Pagination]}
                slidesPerView={slidesPerView || 1}
                pagination={{
                    clickable: true,
                }}
                
            >
                {pagnatedCards.length < 1 ? (
                    !!emptyMessage ? (
                        <Typography variant="h5" fontSize={'1em'} style={{ color: Colors.dark, fontWeight: 'bold' }}>
                            You haven't ordered anything :{`(`}
                        </Typography>
                    ) : (
                        <></>
                    )
                ) : (
                    pagnatedCards.map((cards, i) => (
                        <SwiperSlide style={{overflow:'visible'}}>
                                {cards.map((card) => (
                                    <div
                                        key={card.key}
                                        style={{
                                            marginTop: 10,
                                            marginBottom: 10,
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {card}
                                    </div>
                                ))}
                        </SwiperSlide>
                    ))
                )}
            </Swiper>
        </LoaderWrapper>
    )
}

function pagniateCards<ItemType>(items: ItemType[], limit: number): ItemType[][] {
    if (limit < 1) {
        return []
    }
    let mutableItems = [...items]
    let newArray: any[][] = []
    let timeout = 0
    while (mutableItems.length || timeout > 100) {
        newArray.push(mutableItems.slice(0, limit))
        mutableItems = mutableItems.slice(limit)
        timeout++
    }
    return newArray
}
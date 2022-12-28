import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css/bundle'
import 'swiper/css'
import Radio from '@mui/material/Radio'
import Typography from '@mui/material/Typography'
import { Colors } from '../utils/Colors'

type Props = {
    options: string[]
    onClickOption: (option?: string) => void
    selectedOption: string | undefined
}

export const OptionSwiper = ({ onClickOption, options, selectedOption }: Props) => {
    return (
        <Swiper
            slidesPerView={3}
            style={{
                width: '90%',
                minWidth: 320,
            }}
        >
            {options.map((o) => (
                <SwiperSlide key={o}>
                    <div style={{ display: 'flex', alignItems: 'center', marginRight: 10, marginLeft: 10 }}>
                        <Radio checked={o === selectedOption} onClick={() => onClickOption(o)} />
                        <Typography variant="subtitle1" fontSize={'1em'} style={{ color: Colors.light }}>
                            {o}
                        </Typography>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

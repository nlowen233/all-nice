import { Typography } from '@mui/material'
import React from 'react'
import { Colors } from '../utils/Colors'
import { Constants } from '../utils/Constants'

type Props = {
    screenWidth?: number
}

export const Footer = ({screenWidth}:Props) => {
    return (
        <div style={{backgroundColor: Colors.darkest, width:'100%',height:Constants.footerHeight(screenWidth) }}>
            <div style={{ padding: 20, backgroundColor: Colors.darkest }}>
                <Typography color="secondary" variant="subtitle1">
                    Follow us on insta
                </Typography>
            </div>
        </div>
    )
}

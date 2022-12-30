import { IconButton } from '@mui/material'
import Typography from '@mui/material/Typography'
import React, { useEffect } from 'react'
import { BannerMessage } from '../contexts/MessageBannerContext'
import { ZIndex } from '../types/ZIndex'
import { Colors } from '../utils/Colors'
import { Constants } from '../utils/Constants'
import CloseIcon from '@mui/icons-material/Close'

type Props = {
    bannerMessage?: BannerMessage
    close: () => void
}

export const MessageBanner = ({ bannerMessage, close }: Props) => {
    useEffect(() => {
        if (!bannerMessage?.autoClose) {
            return
        }
        const interval = setTimeout(close, bannerMessage.autoClose)
        return () => {
            clearInterval(interval)
        }
    }, [close])
    return (
        <div
            style={{
                backgroundColor: bannerMessage?.styling?.backgroundColor || Colors.light,
                position: 'fixed',
                width: '100%',
                zIndex: ZIndex.messageBanner,
                top: Constants.menuBarHeight,
                minHeight: 40,
                opacity: !!bannerMessage ? 1 : 0,
                transition: '400ms',
                pointerEvents: !!bannerMessage ? undefined : 'none',
            }}
        >
            <div
                style={{
                    width: '100%',
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    padding:10
                }}
            >
                <Typography variant="h2" fontSize={'1em'} style={{ color: bannerMessage?.styling?.fontColor || Colors.lightest }}>
                    {bannerMessage?.title}
                </Typography>
                <div style={{ position: 'absolute', top: 0, right: 20 }}>
                    <IconButton color="primary" onClick={close} sx={{ color: Colors.lightest }}>
                        <CloseIcon />
                    </IconButton>
                </div>
            </div>
        </div>
    )
}

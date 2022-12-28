import React from 'react'

export interface BannerMessage {
    title: string
    autoClose?: number
    styling?: {
        backgroundColor?: string
        fontColor?: string
    }
}

export interface MessageBannerShape {
    pushBannerMessage: (message: BannerMessage) => void
}

export const MessageBannerContext = React.createContext<MessageBannerShape>({
    pushBannerMessage: () => {},
})

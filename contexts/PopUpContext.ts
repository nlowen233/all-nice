import React, { Dispatch } from 'react'

export interface PopUpMessage {
    title?: string
    message: string
    id?: string
    options?: string[]
}

export interface PopUpRes {
    id?: string
    option?: string
}

export interface PopUpContextShape {
    pushPopUpMessage: (msg: PopUpMessage) => void
    popUpRes: PopUpRes | undefined
}

export const PopUpContext = React.createContext<PopUpContextShape>({
    pushPopUpMessage: () => {},
    popUpRes: undefined,
})

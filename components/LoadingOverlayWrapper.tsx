import React, { useState, use } from 'react'
import { LoadingOverlayContext } from '../contexts/LoadingOverlayContext'
import { LoadingOverlay } from './LoadingOverlay'

type Props = {
    children?: React.ReactNode
    on: boolean
    toggle: (b: boolean) => void
}

export const LoadingOverlayWrapper = ({ children, on, toggle }: Props) => {
    return (
        <LoadingOverlayContext.Provider value={{ on, toggle }}>
            <LoadingOverlay loading={on} />
            {children}
        </LoadingOverlayContext.Provider>
    )
}

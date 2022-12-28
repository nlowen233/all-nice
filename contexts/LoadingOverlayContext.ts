import React from 'react'

export interface LoadingOverlayShape {
    on: boolean
    toggle: (b: boolean) => void
}

export const LoadingOverlayContext = React.createContext<LoadingOverlayShape>({
    on: false,
    toggle: () => {},
})

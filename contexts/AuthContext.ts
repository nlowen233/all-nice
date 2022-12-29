import React, { Dispatch } from 'react'

export interface AuthContextVars {
    token: string | undefined
    expiresAt: string | undefined
    returnToRoute: string | undefined
}

export interface AuthContextShape extends AuthContextVars {
    setAuth: Dispatch<React.SetStateAction<Partial<AuthContextVars>>>
    checkedLocalStorage: boolean
}

export const AuthContext = React.createContext<AuthContextShape>({
    token: undefined,
    expiresAt: undefined,
    setAuth: () => ({}),
    returnToRoute: undefined,
    checkedLocalStorage: false,
})

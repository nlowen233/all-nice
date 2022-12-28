import React from 'react'

export interface AuthContextVars {
    token: string | undefined
    expiresAt: string | undefined
    returnToRoute: string | undefined
}

export interface AuthContextShape extends AuthContextVars {
    setAuth: (auth: Partial<AuthContextVars>) => void
}

export const AuthContext = React.createContext<AuthContextShape>({
    token: undefined,
    expiresAt: undefined,
    setAuth: () => {},
    returnToRoute: undefined,
})

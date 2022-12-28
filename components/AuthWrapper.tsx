import React, { useState, use } from 'react'
import { AuthContext, AuthContextVars } from '../contexts/AuthContext'

type Props = {
    children?: React.ReactNode
}

export const AuthWrapper = ({ children }: Props) => {
    const [auth, setAuth] = useState<Partial<AuthContextVars>>({})

    return (
        <AuthContext.Provider value={{ expiresAt: auth.expiresAt, token: auth.token, setAuth, returnToRoute: auth.returnToRoute }}>
            {children}
        </AuthContext.Provider>
    )
}

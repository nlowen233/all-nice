import React from 'react'
import { UseProfileSig } from '../hooks/useProfile'

export const ProfileContext = React.createContext<UseProfileSig>({
    clear: () => {},
    profile: undefined,
    profileLoading: false,
    refresh: () => {},
})

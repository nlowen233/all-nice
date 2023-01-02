import React from 'react'
import { UseCartSig } from '../hooks/useCart'

export const CartContext = React.createContext<UseCartSig>({
    Cart: {
        add: async () => {},
        remove: async () => {},
        get: async () => {},
        update: async () => {},
    },
    cart: undefined,
    isCartUpdating: false,
    cartDeletionID: undefined,
})

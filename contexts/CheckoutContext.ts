import React from 'react'
import { UseCheckoutSig } from '../hooks/useCheckout'

export const CheckoutContext = React.createContext<UseCheckoutSig>({
   checkout: undefined, 
   createCheckout:async ()=>{},
   creatingCheckout: false
})

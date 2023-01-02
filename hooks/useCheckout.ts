import _, { DebouncedFunc } from 'lodash'
import React, { useEffect, useState, useCallback, useContext, useMemo } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { BannerMessage, MessageBannerContext } from '../contexts/MessageBannerContext'
import { LoadState } from '../types/misc'
import {
    AddCartLineParams,
    API,
    CartRes,
    CreateCartParams,
    CreateCheckoutParams,
    CreateOrAddCartLineParams,
    RemoveCartLine,
    ReomveCartLineParams,
    ShopifyCheckout,
    ShopifyProfile,
    UpdateCartLine,
    UpdateCartLineParams,
} from '../utils/API'
import { Colors } from '../utils/Colors'
import { Constants } from '../utils/Constants'
import { Utils } from '../utils/Utils'

export interface UseCheckoutSig {
    createCheckout: (p:CreateCheckoutParams)=>Promise<void>
    checkout: ShopifyCheckout|undefined
    creatingCheckout: boolean
}

export interface UseCheckoutParams {
    pushBannerMessage: (msg: BannerMessage) => void
    token: string | undefined
}

export const useCheckout = ({ pushBannerMessage, token }: UseCheckoutParams): UseCheckoutSig => {
    const [checkout,setCheckout] = useState<undefined|ShopifyCheckout>(undefined)
    const [creatingCheckout,setCreatingCheckout] = useState(false)

    const createCheckout = async ({email,lineItems,shippingAddress}:CreateCheckoutParams) =>{
        setCreatingCheckout(true)
        const res = await API.createCheckout({
            email,
            lineItems,
            shippingAddress
        })
        const errors = res.res?.errors||[]
        const userErrors = res.res?.data?.checkoutUserErrors||[]
        if(errors.length||userErrors.length||res.err){
            pushBannerMessage({
                title: Constants.checkoutError(res.message||errors[0]?.message||userErrors[0]?.message),
                autoClose:Constants.stdAutoCloseInterval,
                styling:{backgroundColor:Colors.error}
            })
        } else{
            setCheckout(res.res?.data?.checkoutCreate)
        }
        setCreatingCheckout(false)
    }

    return({
        createCheckout,
        checkout,
        creatingCheckout
    })
}

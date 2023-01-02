import React, { useEffect, useState, useCallback, useContext, useMemo } from 'react'
import { BannerMessage} from '../contexts/MessageBannerContext'
import {
    API,
    ShopifyProfile,
} from '../utils/API'
import { Colors } from '../utils/Colors'
import { Constants } from '../utils/Constants'
import { Utils } from '../utils/Utils'

interface CallParams {
    silent?: boolean
}

export interface UseProfileSig {
    profile: ShopifyProfile | undefined
    profileLoading: boolean
    refresh: (p?: CallParams) => void
    clear: () => void
}

export interface UseProfileParams {
    pushBannerMessage: (msg: BannerMessage) => void
    token: string | undefined
}

export const useProfile = ({ pushBannerMessage, token }: UseProfileParams): UseProfileSig => {
    const [profile, setProfile] = useState<ShopifyProfile | undefined>(undefined)
    const [profileLoading, setProfileLoading] = useState(false)
    const [cachedToken, setCachedToken] = useState<string | undefined>(undefined)
    const get = async (p?: CallParams) => {
        if (!token) {
            return
        }
        setProfileLoading(true)
        const res = await API.getProfile({ customerAccessToken: token })
        const shopifyErrors = res.res?.errors || []
        if (res.err || !!shopifyErrors?.length) {
            !p?.silent &&
                pushBannerMessage({
                    title: res.message || shopifyErrors[0].message || 'Unknown error occured while loading profile data',
                    autoClose: Constants.stdAutoCloseInterval,
                    styling: { backgroundColor: Colors.error },
                })
        } else {
            setProfile(res.res?.data?.customer)
        }
        setProfileLoading(false)
    }
    useEffect(() => {
        if (token && cachedToken !== token) {
            get({ silent: true })
            setCachedToken(token)
        }
    }, [token])
    return {
        profile,
        profileLoading,
        clear: () => setProfile(undefined),
        refresh: get,
    }
}

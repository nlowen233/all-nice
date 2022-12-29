import dayjs from 'dayjs'
import Dinero from 'dinero.js'

const windowExists = () => typeof window === 'object' && window !== null
const displayPriceRange = (min?: string, max?: string) => {
    const [nmin, nmax] = [Number(min) * 100, Number(max) * 100]
    if (nmax === nmin) {
        return Dinero({ amount: nmax, precision: 2 }).toFormat('$0,0.00')
    } else {
        return `${Dinero({ amount: nmin }).toFormat('$0,0.00')} - ${Dinero({ amount: nmax }).toFormat('$0,0.00')}`
    }
}
const displayPrice = (price?: string, quantity?: number) =>
    Dinero({ amount: Number(price) * 100, precision: 2 })
        .multiply(quantity || 1)
        .toFormat('$0,0.00')

const storeToken = (value?: string, expDate?: string) => {
    if (!value || !expDate) {
        return
    }
    localStorage.setItem('TOKEN', value)
    localStorage.setItem('EXPDATE', expDate)
}

const getToken = () => {
    const token = localStorage.getItem('TOKEN')
    const expDate = localStorage.getItem('EXPDATE')
    if (!!expDate && dayjs(expDate).isBefore(dayjs())) {
        clearToken()
        return [undefined, undefined]
    }
    return [token || undefined, expDate || undefined]
}

const clearToken = () => {
    localStorage.removeItem('EXPDATE')
    localStorage.removeItem('TOKEN')
}

export interface DisplayAddressParams {
    city?: string|null
    zip?: string|null
    stateCode?: string|null
}

const displayAddress = ({city,stateCode,zip}:DisplayAddressParams) => city||zip||stateCode ? `${city||'Unknown City'} ${stateCode||'??'} ${zip||'Unknown Zip'}` : ``

export const Utils = {
    windowExists,
    displayPriceRange,
    displayPrice,
    getToken,
    storeToken,
    clearToken,
    displayAddress
}

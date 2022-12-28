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

export const Utils = {
    windowExists,
    displayPriceRange,
    displayPrice,
}

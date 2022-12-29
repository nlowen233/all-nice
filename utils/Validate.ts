const notEmpty = (s?: string) => !!s?.trim()?.length
const phoneNumber = (s?: string) => {
    if (!s) {
        return false
    }
    const length = s?.length || 0
    return length > 10 && length < 15 && !Number.isNaN(Number(s))
}

export const Validate = {
    notEmpty,
    phoneNumber,
}

import React from 'react'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Colors } from '../utils/Colors'

type Props = {
    value: number
    onChange: (n: number) => void
    disabled?: boolean
    max?: number
    min?: number
}

export const QuantityButton = ({ onChange, value, disabled, max, min }: Props) => {
    const canDec = value >= (min || 2) && !disabled
    const canInc = value <= (max || 98) && !disabled
    return (
        <div style={{ display: 'flex', border: `1px solid ${Colors.dark}`, borderRadius: 10, alignItems: 'center' }}>
            <div
                onClick={() => canDec && onChange(-1)}
                style={{
                    color: canDec ? undefined : Colors.disabled,
                    cursor: canDec ? 'pointer' : undefined,
                    paddingRight: 5,
                    paddingLeft: 10,
                }}
            >
                -
            </div>
            <Typography
                variant="subtitle1"
                fontSize={'1em'}
                style={{ color: Colors.dark, marginLeft: 5, marginRight: 5, width: 88, textAlign: 'center' }}
            >
                Quantity: {value}
            </Typography>
            <div
                onClick={() => canInc && onChange(1)}
                style={{
                    color: canInc ? undefined : Colors.disabled,
                    cursor: canInc ? 'pointer' : undefined,
                    paddingRight: 10,
                    paddingLeft: 5,
                }}
            >
                +
            </div>
        </div>
    )
}

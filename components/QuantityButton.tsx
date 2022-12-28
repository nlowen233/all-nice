import React from 'react'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Colors } from '../utils/Colors'

type Props = {
    value: number
    onChange: (n: number) => void
}

export const QuantityButton = ({ onChange, value }: Props) => {
    return (
        <div
            style={{ display: 'flex', border: `1px solid ${Colors.dark}`, borderRadius: 10, width: 224, backgroundColor: Colors.lightest }}
        >
            <Button size="small" onClick={() => onChange(-1)} disabled={value < 2}>
                -
            </Button>
            <Typography
                variant="subtitle1"
                fontSize={'1em'}
                style={{ color: Colors.dark, marginLeft: 5, marginRight: 5, width: 88, textAlign: 'center' }}
            >
                Quantity: {value}
            </Typography>
            <Button size="small" onClick={() => onChange(1)} disabled={value > 98}>
                +
            </Button>
        </div>
    )
}

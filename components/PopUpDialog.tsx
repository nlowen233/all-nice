import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { PopUpMessage, PopUpRes } from '../contexts/PopUpContext'

export interface PopUpCloseEvent {
    option?: string
    id?: string
}

type Props = {
    close: ({ id, option }: PopUpCloseEvent) => void
    open?: boolean
    popUpMessage?: PopUpMessage
}

export const PopUpDialog = ({ close, open, popUpMessage }: Props) => {
    const options = popUpMessage?.options || ['Ok']
    return (
        <Dialog open={!!open} onClose={() => close({})} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">{popUpMessage?.title || 'Alert'}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{popUpMessage?.message || ''}</DialogContentText>
            </DialogContent>
            <DialogActions>
                {options.map((op, i) => (
                    <Button onClick={() => close({ id: popUpMessage?.id, option: op })} autoFocus={i === 1} key={op}>
                        {op}
                    </Button>
                ))}
            </DialogActions>
        </Dialog>
    )
}

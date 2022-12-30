import { Typography } from '@mui/material'
import React, { useRef } from 'react'
import { ShopifyAddress, ShopifyOrder } from '../utils/API'
import { Colors } from '../utils/Colors'
import styles from '../styles/components/OrderCard.module.css'
import { Utils } from '../utils/Utils'
import Link from 'next/link'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import StarIcon from '@mui/icons-material/Star'
import { Constants } from '../utils/Constants'

type Props = {
    address?: Partial<ShopifyAddress>
    isDefault?: boolean
    onToggleDefault?: () => void
    onClickEdit?: () => void
    width?: number
}

const BOTTOM_MARGIN = 15

export const AddressCard = ({ address, isDefault, onClickEdit, onToggleDefault,width }: Props) => {
    return (
        <div
            style={{
                width: width||'100%',
                borderTop: `1px solid ${Colors.lightest}`,
                display: 'grid',
                rowGap: 5,
                position: 'relative',
                backgroundColor: 'white',
                paddingTop:10,
                paddingBottom:10,
                marginBottom: BOTTOM_MARGIN,
            }}
        >
            <Typography variant="subtitle1" fontSize={'1em'} color='primary'>
                {address?.firstName} {address?.lastName}
            </Typography>
            <Typography variant="subtitle1" fontSize={'1em'} color='primary'>
                {address?.address1} {address?.address2}
            </Typography>
            <Typography variant="subtitle1" fontSize={'1em'} color='primary'>
                {Utils.displayAddress({ city: address?.city, stateCode: address?.provinceCode, zip: address?.zip })}
            </Typography>
            {onToggleDefault&&onClickEdit&&<div style={{ position: 'absolute', top: 0, right: 0, display: 'flex' }}>
                <IconButton onClick={onToggleDefault} title={isDefault ? 'Default address' : 'Not default address'}>
                    {isDefault ? <StarIcon style={{ color: Colors.star }} /> : <StarBorderIcon />}
                </IconButton>
                <IconButton onClick={onClickEdit} title="Edit or delete">
                    <EditIcon />
                </IconButton>
            </div>}
        </div>
    )
}

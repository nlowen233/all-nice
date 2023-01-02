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
import Checkbox from '@mui/material/Checkbox'

type Props = {
    address?: Partial<ShopifyAddress>
    onSelect?: () => void
    width?: number
    selectedID?: string
}

const BOTTOM_MARGIN = 10

export const CheckoutAddressCard = ({ address, onSelect, width,selectedID }: Props) => {
    return (
        <div
            style={{
                width: width || '100%',
                borderTop: `1px solid ${Colors.lightest}`,
                display: 'grid',
                rowGap: 5,
                position: 'relative',
                paddingTop: 10,
                paddingBottom: 10,
                marginBottom: BOTTOM_MARGIN,
                gridTemplateColumns: '2fr 1fr',
            }}
        >
            <div>
                <Typography variant="subtitle1" fontSize={'1em'} color="primary">
                    {address?.firstName} {address?.lastName}
                </Typography>
                <Typography variant="subtitle1" fontSize={'.9em'} color="primary">
                    {address?.address1} {address?.address2}
                </Typography>
                <Typography variant="subtitle1" fontSize={'.9em'} color="primary">
                    {Utils.displayAddress({ city: address?.city, stateCode: address?.provinceCode, zip: address?.zip })}
                </Typography>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Checkbox
                    checked={Utils.getIDFromShopifyGid(selectedID)===Utils.getIDFromShopifyGid(address?.id)}
                    onClick={() => !!onSelect && onSelect()}
                    inputProps={{ 'aria-label': 'controlled' }}
                    style={{ color: Colors.mid }}
                />
            </div>
        </div>
    )
}

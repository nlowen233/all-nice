import { Typography } from '@mui/material'
import React,{useRef} from 'react'
import { ShopifyAddress, ShopifyOrder } from '../utils/API'
import { Colors } from '../utils/Colors'
import styles from '../styles/components/OrderCard.module.css'
import { Utils } from '../utils/Utils'
import Link from 'next/link'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

type Props = {
    address: ShopifyAddress
    isDefault?: boolean
    onToggleDefault?: ()=>void
    onClickEdit?: ()=>void
}

export const AddressCard = ({ address, isDefault,onClickEdit,onToggleDefault }: Props) => {
    return (
        <div
            style={{
                borderRadius: 10,
                width: 300,
                border: `1px solid ${Colors.light}`,
                padding: 10,
                display: 'grid',
                rowGap: 10,
                marginBottom: 15,
                position:'relative'
            }}
            className={styles.card}
        >
            <Typography variant="subtitle1" fontSize={'1em'} style={{ color: Colors.light }}>
                {address.firstName} {address.lastName}
            </Typography>
            <Typography variant="subtitle1" fontSize={'1em'} style={{ color: Colors.light }}>
                {address.address1} {address.address2}
            </Typography>
            <Typography variant="subtitle1" fontSize={'1em'} style={{ color: Colors.light }}>
                {Utils.displayAddress({ city: address.city, stateCode: address.provinceCode, zip: address.zip })}
            </Typography>
            <div style={{position:'absolute',top:0,right:0,display:'flex'}}>
            <IconButton onClick={onToggleDefault} title={isDefault ? "Default address" : "Not default address"}>
                    {isDefault ? <StarIcon style={{color:Colors.star}}/> : <StarBorderIcon/>}
                </IconButton>
                <IconButton onClick={onClickEdit} title='Edit or delete'>
                    <EditIcon/>
                </IconButton>
            </div>
        </div>
    )
}

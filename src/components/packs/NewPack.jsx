import DiscountIcon from '@mui/icons-material/Discount'
import CancelIcon from '@mui/icons-material/Cancel'
import { Box, IconButton, Popover, Typography } from '@mui/material'
import { useState } from 'react'
import usePrice from '../../hooks/usePrice'
import CurrencyTextField from '../CurrencyTextField'

export default function NewPack({ price, discount, quantity, onChangeQuantity, onChangeDiscount }) {
   const [anchorEl, setAnchorEl] = useState(null)
   const [openAddNewPackDiscount, setOpenAddNewPackDiscount] = useState(false)
   const { getPriceByQuantity, getPriceWithDiscount } = usePrice('')
   const openPopover = Boolean(anchorEl)

   const handleOpenPopover = (event) => {
      setAnchorEl(event.currentTarget)
   }

   const handleClosePopover = () => {
      setAnchorEl(null)
   }

   const handleToggleAddNewPackDiscount = () => {
      if (anchorEl) setAnchorEl(null)
      setOpenAddNewPackDiscount(!openAddNewPackDiscount)
   }

   return (
      <Box display='flex' flexDirection='column' rowGap={2}>
         <Typography variant='h6' fontStyle='italic' fontWeight='bold' fontSize='1.15rem' pl={1}>
            Nuevo Pack
         </Typography>
         <Box display='flex' justifyContent='space-between' px={2}>
            <Box display='flex' alignItems='center' width='100%' gap={1}>
               <CurrencyTextField
                  id='quantity'
                  label='Cant.'
                  isAllowed={(values) => {
                     const { value, floatValue } = values
                     return value === '' || floatValue >= 0
                  }}
                  sx={{ width: 120 }}
                  value={quantity || ''}
                  onChange={onChangeQuantity}
                  type='number'
                  hideCurrency
                  required
               />
               {quantity && (
                  <CurrencyTextField
                     id='total_price'
                     currency='€'
                     label='Precio sin Dto.'
                     value={getPriceByQuantity(price, quantity)}
                     sx={{ width: 120 }}
                     disabled
                     readOnly
                  />
               )}
               {openAddNewPackDiscount && (
                  <CurrencyTextField
                     id='discount'
                     label='Dto.'
                     isAllowed={(values) => {
                        const { value, floatValue } = values
                        return value === '' || (floatValue >= 0 && floatValue <= 100)
                     }}
                     sx={{ width: 100 }}
                     value={discount || ''}
                     onChange={onChangeDiscount}
                     isDiscountInputType
                  />
               )}
               {price !== 0 && quantity !== 0 && discount !== 0 && openAddNewPackDiscount && (
                  <CurrencyTextField
                     id='total_price'
                     currency='€'
                     label='Precio con Dto.'
                     value={getPriceWithDiscount(price, discount, quantity) || ''}
                     sx={{ width: 120 }}
                     disabled
                     readOnly
                  />
               )}
            </Box>
            <Box display='flex' alignItems='center' gap={1}>
               <IconButton
                  height='fit-content'
                  onClick={handleToggleAddNewPackDiscount}
                  onMouseEnter={handleOpenPopover}
                  onMouseLeave={handleClosePopover}
               >
                  {!openAddNewPackDiscount ? (
                     <>
                        <DiscountIcon color='info' />
                        <Popover
                           id='add-new-pack-discount-popover'
                           sx={{ pointerEvents: 'none' }}
                           open={openPopover}
                           anchorEl={anchorEl}
                           anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'center',
                           }}
                           transformOrigin={{
                              vertical: 'top',
                              horizontal: 'center',
                           }}
                           disableRestoreFocus
                        >
                           <Typography p={1}>Aplicar descuento</Typography>
                        </Popover>
                     </>
                  ) : (
                     <>
                        <CancelIcon color='error' />
                        <Popover
                           id='add-new-pack-discount-popover'
                           sx={{ pointerEvents: 'none' }}
                           open={openPopover}
                           anchorEl={anchorEl}
                           anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'center',
                           }}
                           transformOrigin={{
                              vertical: 'top',
                              horizontal: 'center',
                           }}
                           disableRestoreFocus
                        >
                           <Typography p={1}>Cancelar descuento</Typography>
                        </Popover>
                     </>
                  )}
               </IconButton>
            </Box>
         </Box>
      </Box>
   )
}

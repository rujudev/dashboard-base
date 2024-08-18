import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

import usePrice from '../../hooks/usePrice'
import CurrencyTextField from '../CurrencyTextField'
import { ImgGalleryModal } from '../modals/ImageGallery'
import ActionButtons from '../table/ActionButtons'

export const NEW_FORMAT = {
   isActive: true,
   name: '',
   price: 0,
   discount: 0,
   stock: 0,
   imgGallery: [],
   totalPriceWithDiscount: 0,
}

export default function NewFormat({ onUpdate, onRemove }) {
   const [openModal, setOpenModal] = useState(false)

   const [format, setFormat] = useState({
      id: new Date().getTime() + Math.floor(Math.random() * 10000),
      ...NEW_FORMAT,
   })
   const { getPriceWithDiscount } = usePrice('')

   useEffect(() => {
      if (!format.id) return

      onUpdate(format)
   }, [format])

   const handleChangeName = (event) => {
      const { value: name } = event.target

      console.log(name)
      setFormat((prevFormat) => ({ ...prevFormat, name }))
   }

   const handleChangePrice = (event) => {
      const { value: price } = event.target

      setFormat((prevFormat) => ({ ...prevFormat, price }))
   }

   const handleChangeDiscount = (event) => {
      const { value: discount } = event.target
      let newFormatPropValues = {}

      if (format.price > 0) {
         const priceWithDiscount = getPriceWithDiscount(format.price, discount)

         newFormatPropValues = {
            totalPriceWithDiscount: priceWithDiscount,
         }
      }

      setFormat((prevFormat) => ({ ...prevFormat, discount, ...newFormatPropValues }))
   }

   const handleChangeStock = (event) => {
      const { value } = event.target
      const stock = Number(value)

      setFormat((prevFormat) => ({ ...prevFormat, stock }))
   }

   const handleOpenModal = () => {
      setOpenModal(true)
   }

   const handleCloseModal = () => {
      setOpenModal(false)
   }

   const handleSaveImgGallery = (imgGallery) => {
      setFormat((prevFormat) => ({ ...prevFormat, imgGallery }))
   }

   return (
      <Box display='flex' alignItems='center' gap={2}>
         <TextField id='format.name' label='Nombre' value={format.name} onChange={handleChangeName} required />
         <CurrencyTextField
            id='format.price'
            label='Precio'
            value={format.price || ''}
            onChange={handleChangePrice}
            required
         />
         <CurrencyTextField
            id='format.discount'
            label='Descuento'
            value={format.discount || ''}
            onChange={handleChangeDiscount}
            isDiscountInputType
         />
         <TextField
            id='format.stock'
            label='Unidades'
            value={format.stock || ''}
            type='number'
            onChange={handleChangeStock}
            required
         />
         {format.price !== 0 && format.discount !== 0 && (
            <CurrencyTextField
               id='format.total_price'
               label='Precio total'
               value={getPriceWithDiscount(format.price, format.discount) || ''}
               disabled
               readOnly
            />
         )}
         <ActionButtons
            onOpenModal={() => handleOpenModal()}
            imgGalleryButton
            imgGalleryButtonText={false}
            {...(format.imgGallery.length > 0 && { imgGalleryPopoverText: `${format.imgGallery.length} imágenes` })}
         />
         <ImgGalleryModal
            title='Galería de imágenes nuevo formato'
            open={openModal}
            onClose={handleCloseModal}
            data={{
               images: format.imgGallery,
            }}
            onSave={handleSaveImgGallery}
         />
      </Box>
   )
}

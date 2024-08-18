import { useEffect, useState } from 'react'
import { supabase } from '../../config/supabase-client'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'

import DataTable, { renderResultCell } from '../table/DataTable'
import ActionButtonsCell from '../table/ActionButtonsCell'

import { modalActions } from '../../constants/modal-actions'
import Modal from '../modals/Modal'
import CurrencyTextField from '../CurrencyTextField'

export default function Products({ products, onUpdateProductsList }) {
   const [openModal, setOpenModal] = useState({
      open: false,
      action: '',
      product: null,
   })
   const [nonHiddenProducts, setNonHiddenProducts] = useState([])

   const handleRemoveProduct = async (productId) => {
      supabase
         .from('products')
         .select()
         .single()
         .eq('id', productId)
         .then(({ data, error }) => {
            if (!error) {
               const { img_gallery: imgGallery } = data

               for (const img of imgGallery) {
                  supabase.storage.from('images').remove([`products/${productId}/${img.name}`])
               }
            }
         })

      const { error: deleteProductError } = await supabase.from('products').delete().eq('id', productId)

      if (!deleteProductError) {
         const restOfProducts = products.filter((product) => product.id !== productId)
         onUpdateProductsList(restOfProducts)
      }
   }

   const handleHideProduct = async (productId, isHidden) => {
      const { error: deleteProductError } = await supabase
         .from('products')
         .update({ is_hidden: isHidden })
         .eq('id', productId)

      if (!deleteProductError) {
         const { error: errorProductsData, data: productsData } = await supabase.from('products').select()

         if (!errorProductsData) {
            onUpdateProductsList(productsData)
         }
      }
   }

   const handleOpenModal = (product, action) => {
      setOpenModal({
         open: true,
         action,
         product,
      })
   }

   const handleCloseModal = (event, reason) => {
      if (reason === 'backdropClick') return

      setOpenModal({
         open: false,
         action: '',
         product: null,
      })
   }

   const columns = [
      {
         field: 'thumbnail',
         headerName: 'Imagen Principal',
         width: 135,
         renderCell: ({ row }) => {
            const url = row.thumbnail?.url
            const src =
               url && !url.includes('blob') ? row.thumbnail.url : 'https://via.placeholder.com/150?text=No Image'
            const alt = row.thumbnail?.name ? row.thumbnail.name : 'no thumbnail assigned'

            return (
               <Avatar
                  src={src}
                  alt={alt}
                  sx={{ width: 56, height: 56, '& .MuiAvatar-img': { objectFit: 'contain' } }}
               />
            )
         },
      },
      { field: 'name', headerName: 'Nombre', flex: 1 },
      {
         field: 'category',
         headerName: 'Categoría',
         flex: 1,
      },
      { field: 'stock', headerName: 'Stock', width: 80 },
      {
         field: 'price',
         headerName: 'Precio',
         width: 80,
         renderCell: ({ row }) => {
            const { price } = row

            return renderResultCell({ value: price })
         },
      },
      {
         field: 'with_formats',
         headerName: 'Con Formatos',
         flex: 1,
         renderCell: (params) => {
            const { row } = params
            const { with_formats: withFormats } = row

            return <Checkbox checked={withFormats} readOnly disabled />
         },
      },
      {
         field: 'with_packs',
         headerName: 'Con Packs',
         flex: 1,
         renderCell: (params) => {
            const { row } = params
            const { with_packs: withPacks } = row

            return <Checkbox checked={withPacks} readOnly disabled />
         },
      },
      {
         field: 'action',
         headerName: '',
         pinnable: true,
         align: 'center',
         sortable: false,
         type: 'actions',
         renderCell: ({ id, row }) => {
            const { is_hidden: isHidden } = row

            return (
               <>
                  <ActionButtonsCell
                     itemId={id}
                     page='products'
                     onOpenModal={(action) => handleOpenModal(row, action)}
                     onRemoveItem={handleRemoveProduct}
                     onHideItem={() => handleHideProduct(id, isHidden)}
                     orientation='vertical'
                     hideButtonText={false}
                     hideButton
                     editButton
                     removeButton
                  />
                  {openModal.product?.id === id && (
                     <Modal open={openModal.open}>
                        <Box display='flex' flexDirection='column' gap={2}>
                           <Box display='flex' flexDirection='column' gap={1}>
                              <Typography variant='h5' fontWeight='bold'>
                                 {openModal.action === modalActions.REMOVE ? 'Eliminar producto' : 'Ocultar producto'}
                              </Typography>
                              <Typography variant='subtitle1'>
                                 {openModal.action === modalActions.REMOVE
                                    ? '¿Está seguro de eliminar este producto?'
                                    : '¿Está seguro de ocultar este producto en la web?'}
                              </Typography>
                           </Box>
                           <Box display='flex' width='100%' justifyContent='end' gap={2}>
                              <Button onClick={handleCloseModal}>Cancelar</Button>
                              {openModal.action === modalActions.REMOVE ? (
                                 <Button variant='contained' color='error' onClick={() => handleRemoveProduct(id)}>
                                    Eliminar
                                 </Button>
                              ) : (
                                 <Button
                                    variant='contained'
                                    color='warning'
                                    onClick={() => handleHideProduct(id, true)}
                                 >
                                    Ocultar
                                 </Button>
                              )}
                           </Box>
                        </Box>
                     </Modal>
                  )}
               </>
            )
         },
      },
   ]

   useEffect(() => {
      const hiddenProducts = products.filter((product) => !product.is_hidden)
      setNonHiddenProducts(hiddenProducts)
   }, [products])

   return <DataTable columns={columns} rows={nonHiddenProducts} noRowsDescription='No hay productos creados' />
}

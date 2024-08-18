import { useCallback, useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { GridCellEditStopReasons } from '@mui/x-data-grid'

import usePrice from '../../hooks/usePrice'
import Modal from '../modals/Modal'
import { ImgGalleryModal } from '../modals/ImageGallery'
import ActionButtonsCell from '../table/ActionButtonsCell'
import DataTable, { renderIsActiveCell, renderResultCell, renderEditInputCell, CellVariant } from '../table/DataTable'

import { formatDiscount } from '../../utils'
import { modalActions } from '../../constants/modal-actions'

export default function Formats({ formats, onUpdate, onRemove, onToggleIsActiveSize }) {
   const { getPriceWithDiscount } = usePrice('')
   const [format, setFormat] = useState(null)
   const [openModal, setOpenModal] = useState({
      open: false,
      action: '',
      format: null,
   })

   const toggleIsActiveById = useCallback(({ id, value }) => {
      onUpdate(id, { isActive: value })
   }, [])

   const handleChangeName = useCallback(({ value }) => {
      setFormat((prevFormat) => ({ ...prevFormat, name: value }))
   }, [])

   const handleUpdatePrice = useCallback(({ value }) => {
      setFormat((prevFormat) => ({ ...prevFormat, price: value }))
   }, [])

   const handleUpdateStock = useCallback(({ value }) => {
      const stock = Number(value)
      setFormat({ ...format, stock })
   }, [])

   const handleUpdateDiscount = useCallback(({ value }) => {
      setFormat((prevFormat) => ({ ...prevFormat, discount: value }))
   }, [])

   const handleOpenModal = useCallback((row, action) => {
      setOpenModal({
         open: true,
         action,
         format: row,
      })
   }, [])

   const handleCloseModal = useCallback(() => {
      setOpenModal({
         open: false,
         action: '',
         format: null,
      })
   }, [])

   const handleRemoveFormat = useCallback(({ id }) => {
      onRemove(id)
   }, [])

   const handleSaveImgGallery = (id, imgGallery) => {
      setFormat((prevFormat) => ({ ...prevFormat, imgGallery }))
      onUpdate(id, { imgGallery })
   }

   const columns = [
      {
         field: 'isActive',
         headerName: 'Activo',
         maxWidth: 70,
         renderCell: (params) => {
            const { isActive: rowIsActive, stock: rowStock } = params.row
            const parsedStock = Number(rowStock)
            const isActive = rowIsActive && parsedStock > 0
            const disabled = parsedStock === 0

            return renderIsActiveCell({
               onToggleCheckedById: toggleIsActiveById,
               isActive,
               disabled,
               ...params,
            })
         },
      },
      {
         field: 'name',
         editable: true,
         headerName: 'Nombre',
         flex: 1,
         renderEditCell: (params) => {
            return renderEditInputCell({
               onHandleChange: handleChangeName,
               ...params,
            })
         },
      },
      {
         field: 'stock',
         editable: true,
         headerName: 'Stock',
         flex: 1,
         renderEditCell: (params) => {
            return renderEditInputCell({
               onHandleChange: handleUpdateStock,
               variant: CellVariant.STOCK,
               ...params,
            })
         },
      },
      {
         field: 'price',
         headerName: 'Precio',
         editable: true,
         flex: 1,
         renderCell: ({ row }) => {
            const { price } = row

            return renderResultCell({ value: price })
         },
         renderEditCell: (params) => {
            return renderEditInputCell({
               onHandleChange: handleUpdatePrice,
               variant: CellVariant.PRICE,
               ...params,
            })
         },
      },
      {
         field: 'discount',
         editable: true,
         headerName: 'Descuento (%)',
         flex: 1,
         renderEditCell: (params) => {
            const { discount } = params.row
            const parsedDiscount = formatDiscount(discount)

            return renderEditInputCell({
               onHandleChange: handleUpdateDiscount,
               variant: CellVariant.DISCOUNT,
               value: parsedDiscount,
               ...params,
            })
         },
         sortComparator: (v1, v2) => {
            const discount1 = formatDiscount(v1)
            const discount2 = formatDiscount(v2)

            return discount1 - discount2
         },
      },
      {
         field: 'totalPriceWithDiscount',
         headerName: 'Precio con Dto.',
         flex: 1,
         renderCell: ({ row }) => {
            const { price, discount } = row
            const parsedDiscount = formatDiscount(discount)
            const priceWithDiscount = getPriceWithDiscount(price, parsedDiscount)

            return renderResultCell({ value: priceWithDiscount })
         },
      },
      {
         field: 'action',
         headerName: '',
         pinnable: true,
         align: 'center',
         sortable: false,
         renderCell: ({ row }) => {
            const { id, imgGallery } = row
            const hasImgGallery = imgGallery && imgGallery.length > 0

            return (
               <>
                  <ActionButtonsCell
                     itemId={id}
                     onOpenModal={(action) => handleOpenModal(row, action)}
                     onRemoveItem={() => onRemove(id)}
                     removeButton
                     removeButtonText={false}
                     hideMenuButton
                     imgGalleryButton
                     imgGalleryButtonText={false}
                     {...(hasImgGallery && {
                        imgGalleryPopoverText: `${imgGallery.length} imágenes`,
                     })}
                  />
                  {openModal.format?.id === id && (
                     <Box width='100vw' height='100vh' position='relative'>
                        <Modal open={openModal.open}>
                           {openModal.action === modalActions.REMOVE && (
                              <>
                                 <Box display='flex' flexDirection='column' gap={2}>
                                    <Typography variant='h5' fontWeight='bold'>
                                       Eliminar Formato
                                    </Typography>
                                    <Typography variant='subtitle1'>
                                       Estás a punto de eliminar el formato
                                       <b>
                                          <i>`{openModal.format?.name}`</i>
                                       </b>
                                       . ¿Quieres continuar?
                                    </Typography>
                                    <Box display='flex' width='100%' justifyContent='end' gap={2}>
                                       <Button variant='contained' onClick={() => handleRemoveFormat(id)}>
                                          Eliminar
                                       </Button>
                                       <Button variant='contained' color='error' onClick={handleCloseModal}>
                                          Cancelar
                                       </Button>
                                    </Box>
                                 </Box>
                              </>
                           )}
                           {openModal.action === modalActions.IMG_GALLERY && (
                              <ImgGalleryModal
                                 title={
                                    <Box>
                                       <Typography variant='h5'>Galería de mágenes</Typography>
                                       <Typography
                                          variant='h6'
                                          fontStyle='italic'
                                       >{`Formato: "${openModal.format?.name}"`}</Typography>
                                    </Box>
                                 }
                                 open={openModal.open}
                                 onClose={handleCloseModal}
                                 data={{
                                    images: openModal.format.imgGallery || [],
                                 }}
                                 onSave={(imgGallery) => handleSaveImgGallery(id, imgGallery)}
                              />
                           )}
                        </Modal>
                     </Box>
                  )}
               </>
            )
         },
      },
   ]

   return (
      <DataTable
         columns={columns}
         rows={formats}
         noRowsDescription='No se han creado formatos'
         onCellEditStart={({ row }) => setFormat(row)}
         onCellEditStop={(params, event) => {
            const { reason } = params

            if (reason === GridCellEditStopReasons.enterKeyDown) {
               const { row, field } = params

               let updatedFormat = {
                  [field]: format[field],
               }

               if (field === CellVariant.PRICE || field === CellVariant.DISCOUNT) {
                  const priceWithDiscount = getPriceWithDiscount(format.price, format.discount)

                  updatedFormat = {
                     ...updatedFormat,
                     totalPriceWithDiscount: priceWithDiscount,
                  }
               }

               onUpdate(row.id, updatedFormat)
            }

            if (reason === GridCellEditStopReasons.cellFocusOut) {
               event.preventDefault()
            }
         }}
         hideToolbar
         hideFooter
      />
   )
}

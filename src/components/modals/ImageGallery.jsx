import { useEffect, useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import Modal from './Modal'
import ConfirmCancelModal from './ConfirmCancel'
import { ImageGallery } from '../image/Gallery'

export function ImgGalleryModal({
   open,
   onClose,
   title,
   data = { images: [{ id: 0, isThumbnail: false, name: '', url: '' }] },
   maxListSize = 6,
   onSave,
}) {
   const [imgGallery, setImgGallery] = useState([])
   const [openConfirmCancelModal, setOpenConfirmCancelModal] = useState(false)
   const [isGalleryChanged, setIsGalleryChanged] = useState(false)

   const handleChangeImgGallery = (files) => {
      const slicedFiles = files.slice(0, maxListSize)

      setImgGallery((prevImgGallery) => {
         let nextImgGallery = [...prevImgGallery]

         for (const [key, value] of Object.entries(slicedFiles)) {
            const id = prevImgGallery.length + Number(key) + 1
            const url = URL.createObjectURL(value)

            if (nextImgGallery.length === maxListSize) return nextImgGallery

            nextImgGallery = [...nextImgGallery, { id, isThumbnail: false, name: value.name, url, file: value }]
         }

         setIsGalleryChanged(true)
         return nextImgGallery
      })
   }

   const handleSelectImages = (event) => {
      const { files: targetFiles } = event.target
      const files = Array.from(targetFiles)

      handleChangeImgGallery(files)
   }

   const handleSelectThumbnail = (id) => {
      setImgGallery((prevImgGallery) => {
         setIsGalleryChanged(true)
         return prevImgGallery.map((img) => ({
            ...img,
            isThumbnail: img.id === id,
         }))
      })
   }

   const handleDeleteImage = (id) => {
      setImgGallery((prevImgGallery) => {
         if (data.images.length === 0 && prevImgGallery.length - 1 === 0) {
            setIsGalleryChanged(false)
            return []
         }

         setIsGalleryChanged(true)
         return prevImgGallery.filter((img) => img.id !== id)
      })
   }

   const handleSave = () => {
      if (onSave) {
         setIsGalleryChanged(false)
         onSave(imgGallery)
      }
   }

   const handleCloseModal = () => {
      if (isGalleryChanged) {
         setOpenConfirmCancelModal(true)
         return
      }

      onClose()
   }

   const handleCloseConfirmModal = () => {
      setOpenConfirmCancelModal(false)
   }

   const handleNonSaveChanges = () => {
      setOpenConfirmCancelModal(false)

      const gallery = data.images
      setImgGallery(gallery)
      onClose()
   }

   useEffect(() => {
      if (data.images.length === 0) return

      const gallery = data.images
      setImgGallery(gallery)
   }, [])

   return (
      <>
         <Modal open={open} width='max-content'>
            <Box display='flex' flexDirection='column' gap={2}>
               <Box display='flex' justifyContent='space-between' gap={2}>
                  <Typography id='modal-title' variant='h6'>
                     {title}
                  </Typography>
                  <Box display='flex' justifyContent='end' alignItems='center' gap={2} height='fit-content'>
                     <Button
                        onClick={handleSave}
                        startIcon={<SaveIcon />}
                        variant='contained'
                        color='success'
                        disabled={!isGalleryChanged}
                        sx={{ height: 'fit-content' }}
                     >
                        <Typography variant='button'>Guardar</Typography>
                     </Button>
                     <Button startIcon={<CancelIcon />} onClick={handleCloseModal} variant='contained' color='error'>
                        Cancelar
                     </Button>
                  </Box>
               </Box>
               <ImageGallery
                  data={imgGallery}
                  onDelete={handleDeleteImage}
                  onDrop={handleChangeImgGallery}
                  onSelectImage={handleSelectImages}
                  onSelectThumbnail={handleSelectThumbnail}
               />
            </Box>
            <ConfirmCancelModal
               title='Hay cambios sin guardar. ¿Quieres continuar?'
               open={openConfirmCancelModal}
               onConfirm={handleNonSaveChanges}
               onCancel={handleCloseConfirmModal}
            />
         </Modal>
      </>
   )
}

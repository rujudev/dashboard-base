import { useState } from 'react'

import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import MuiButtonGroup from '@mui/material/ButtonGroup'

import EditIcon from '@mui/icons-material/Edit'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import CollectionsIcon from '@mui/icons-material/Collections'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

import Button from '../Button'

import { modalActions } from '../../constants/modal-actions'

export default function ActionButtons({
   itemId = '',
   page = '',
   hideButton = false,
   hideIcon = <VisibilityOffIcon />,
   hideButtonText = true,
   imgGalleryButton = false,
   imgGalleryButtonText = true,
   imgGalleryPopoverText = 'Sin imágenes',
   editButton = false,
   editButtonText = true,
   removeButton = false,
   removeButtonText = true,
   orientation = 'vertical',
   onHideItem,
   onRemoveItem,
   onOpenModal,
   onCloseMenu,
}) {
   const [anchorEl, setAnchorEl] = useState(null)
   const open = Boolean(anchorEl)

   const buttonCommonStyles = {
      width: '100%',
      display: 'flex',
      justifyContent: 'start',
      gap: 1,
      border: 0,
      '&:hover': { border: 0 },
   }

   const handleHide = () => {
      onCloseMenu && onCloseMenu()
      onOpenModal(modalActions.HIDE)
   }

   const handleRemove = () => {
      onCloseMenu && onCloseMenu()
      onOpenModal(modalActions.REMOVE)
   }

   const handleEdit = () => {
      onCloseMenu && onCloseMenu()
      onOpenModal(modalActions.EDIT)
   }

   const handleOpenImgGalleryModal = () => {
      onCloseMenu && onCloseMenu()
      onOpenModal(modalActions.IMG_GALLERY)
   }

   const handlePopoverOpen = (event) => {
      setAnchorEl(event.currentTarget)
   }

   const handlePopoverClose = () => {
      setAnchorEl(null)
   }

   return (
      <MuiButtonGroup
         size='small'
         aria-label='action button group'
         orientation={orientation}
         sx={{ display: 'flex', gap: 1, padding: 1 }}
      >
         {hideButton && (
            <Button
               color='info'
               icon={hideIcon}
               onClick={() => (hideButton ? handleHide(itemId) : null)}
               text={!hideButtonText && 'Ocultar'}
               sx={buttonCommonStyles}
            />
         )}
         {imgGalleryButton && (
            <>
               <Button
                  color='info'
                  onClick={() => handleOpenImgGalleryModal()}
                  icon={<CollectionsIcon />}
                  text={imgGalleryButtonText && 'Galería de imágenes'}
                  sx={buttonCommonStyles}
                  onMouseEnter={handlePopoverOpen}
                  onMouseLeave={handlePopoverClose}
               />
               <Popover
                  id='gallery-popover'
                  sx={{
                     pointerEvents: 'none',
                  }}
                  open={open}
                  anchorEl={anchorEl}
                  anchorOrigin={{
                     vertical: 'bottom',
                     horizontal: 'center',
                  }}
                  transformOrigin={{
                     vertical: 'top',
                     horizontal: 'center',
                  }}
                  onClose={handlePopoverClose}
                  disableRestoreFocus
               >
                  <Typography variant='subtitle1' color='rgb(150, 150, 150)' padding={1}>
                     {imgGalleryPopoverText}
                  </Typography>
               </Popover>
            </>
         )}
         {editButton && (
            <Button
               {...(page ? { to: `/${page}/${itemId}/edit` } : { onClick: () => handleEdit() })}
               color='info'
               icon={<EditIcon />}
               text={!hideButtonText && 'Editar'}
               sx={buttonCommonStyles}
            />
         )}
         {removeButton && (
            <Button
               color='error'
               onClick={() => (removeButton ? handleRemove(itemId) : null)}
               icon={<DeleteForeverIcon />}
               text={!hideButtonText && 'Eliminar'}
               sx={buttonCommonStyles}
            />
         )}
      </MuiButtonGroup>
   )
}

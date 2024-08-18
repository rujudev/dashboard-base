import { useEffect, useState } from 'react'

// Material UI components
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Material UI Icons
import CategoryIcon from '@mui/icons-material/Category'

// Custom components
import DataTable from '../../../table/DataTable'
import Tag from '../tags/Tag'
import ActionButtonsCell from '../../../table/ActionButtonsCell'
import Modal from '../../../modals/Modal'

import { modalActions } from '../../../../constants/modal-actions'
import { getNonDeletedSubCategoryTags } from '../../../../utils/categories'
import { NO_IMAGE_URL } from '../../../../constants'

export default function Tags({ data, onUpdate, onSave, onRemove, ...props }) {
   const [tags, setTags] = useState([])
   const [openTagModal, setOpenTagModal] = useState({
      open: false,
      tag: null,
   })
   const [openRemoveModal, setOpenRemoveModal] = useState({
      open: false,
      tag: null,
   })

   const tagColumns = [
      {
         field: 'thumbnail',
         headerName: 'Imagen principal',
         flex: 1,
         renderCell: ({ row }) => {
            const src = row.thumbnail?.url ? row.thumbnail.url : NO_IMAGE_URL
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
      {
         field: 'name',
         headerName: 'Nombre',
         flex: 1,
      },
      {
         field: 'action',
         headerName: '',
         pinnable: true,
         align: 'center',
         sortable: false,
         renderCell: ({ id, row }) => {
            return (
               <>
                  <ActionButtonsCell
                     itemId={id}
                     removeButton
                     editButton
                     removeButtonText={false}
                     onOpenModal={(action) => {
                        if (action === modalActions.REMOVE) {
                           toggleRemoveModal({ tag: row })
                        } else {
                           toggleTagModal({ tag: row })
                        }
                     }}
                     hideButtonText
                     hideMenuButton
                  />
                  <Modal open={openRemoveModal.open} onClose={toggleRemoveModal}>
                     <Typography variant='h5'>Eliminar etiqueta</Typography>
                     <Typography variant='subtitle1'>
                        ¿Estás seguro de eliminar la etiqueta <b>&lsquo;{row.name}&rsquo;</b>
                     </Typography>
                     <Box display='flex' width='100%' justifyContent='end'>
                        <Button onClick={toggleRemoveModal}>Cancelar</Button>
                        <Button onClick={() => handleRemove(openRemoveModal.tag.id)}>Eliminar</Button>
                     </Box>
                  </Modal>
               </>
            )
         },
      },
   ]

   const toggleRemoveModal = (params) => {
      const tag = params?.tag ?? null

      setOpenRemoveModal((prevOpenRemoveTagModal) => ({
         open: !prevOpenRemoveTagModal.open,
         tag,
      }))
   }

   const toggleTagModal = (params) => {
      const tag = params?.tag ?? null

      setOpenTagModal((prevOpenTagModal) => ({
         open: !prevOpenTagModal.open,
         tag,
      }))
   }

   const handleRemove = (tagId) => {
      toggleRemoveModal()
      onRemove(tagId)
   }

   useEffect(() => {
      if (!data || !Array.isArray(data)) return

      const existDeletedTags = data.some((tag) => tag.deleted)

      if (existDeletedTags) {
         const nonDeletedTags = getNonDeletedSubCategoryTags(data)
         setTags(nonDeletedTags)
         return
      }

      setTags(data)
   }, [data])

   return (
      <>
         <Box display='flex' justifyContent='space-between' alignItems='center' width='100%'>
            <Typography variant='h6' fontWeight='bold'>
               Etiquetas
            </Typography>
            <Button icon={<CategoryIcon />} onClick={toggleTagModal} variant='contained' color='primary'>
               Añadir etiqueta
            </Button>
         </Box>
         <Modal open={openTagModal.open} onClose={toggleTagModal}>
            <Tag data={openTagModal.tag} onUpdate={onUpdate} onSave={onSave} onClose={toggleTagModal} />
         </Modal>
         <DataTable
            columns={tagColumns}
            rows={tags}
            noRowsDescription='No hay etiquetas'
            density='compact'
            hideToolbar
            hideFooter
            {...props}
         />
      </>
   )
}

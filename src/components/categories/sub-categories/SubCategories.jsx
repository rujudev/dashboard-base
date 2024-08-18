import { useEffect, useState } from 'react'

// Material UI componens
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Custom Components
import ActionButtonsCell from '../../table/ActionButtonsCell'
import Modal from '../../modals/Modal'
import DataTable from '../../table/DataTable'
import SubCategory from './SubCategory'

import { getNonDeletedSubCategories } from '../../../utils/categories'
import { NO_IMAGE_URL } from '../../../constants'
import { modalActions } from '../../../constants/modal-actions'

export default function SubCategories({ data, onSave, onUpdate, onRemove, ...props }) {
   const [subCategories, setSubCategories] = useState([])
   const [openSubCategoryModal, setOpenSubCategoryModal] = useState({
      open: false,
      subCategory: null,
   })
   const [openRemoveModal, setOpenRemoveModal] = useState({
      open: false,
      subCategory: null,
   })

   const subCategoriesColumns = [
      {
         field: 'thumbnail',
         headerName: 'Imágen',
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
         field: 'categories',
         headerName: 'Num. Etiquetas',
         flex: 1,
         valueGetter: ({ row }) => (row?.tags ? row.tags.filter((tag) => !tag.deleted).length : 0),
      },
      {
         field: 'action',
         headerName: '',
         pinnable: true,
         align: 'center',
         sortable: false,
         renderCell: ({ row }) => {
            const { id } = row

            return (
               <>
                  <ActionButtonsCell
                     itemId={id}
                     removeButton
                     editButton
                     removeButtonText={false}
                     onOpenModal={(action) => {
                        if (action === modalActions.REMOVE) {
                           toggleRemoveModal({ subCategory: row })
                        } else {
                           toggleSubCategoryModal({ subCategory: row })
                        }
                     }}
                     hideButtonText
                     hideMenuButton
                  />
                  {openRemoveModal.subCategory?.id === id && (
                     <Modal open={openRemoveModal.open} onClose={toggleRemoveModal}>
                        <Typography variant='h5'>Eliminar sub-categoría</Typography>
                        <Typography variant='subtitle1'>
                           ¿Estás seguro de eliminar la sub-categoría <b>&lsquo;{row.name}&rsquo;</b>
                        </Typography>
                        <Box display='flex' width='100%' justifyContent='end'>
                           <Button onClick={toggleRemoveModal}>Cancelar</Button>
                           <Button onClick={() => handleRemove(openRemoveModal.subCategory.id)}>Eliminar</Button>
                        </Box>
                     </Modal>
                  )}
               </>
            )
         },
      },
   ]

   const toggleRemoveModal = (params) => {
      const subCategory = params?.subCategory ?? null

      setOpenRemoveModal((prevOpenRemoveModal) => ({
         open: !prevOpenRemoveModal.open,
         subCategory,
      }))
   }

   const toggleSubCategoryModal = (params) => {
      const subCategory = params?.subCategory ?? null

      setOpenSubCategoryModal((prevOpenSubCategory) => ({
         open: !prevOpenSubCategory.open,
         subCategory,
      }))
   }

   const handleRemove = (subCategoryId) => {
      toggleRemoveModal()
      onRemove(subCategoryId)
   }

   useEffect(() => {
      if (data.length === 0) {
         setSubCategories([])
         return
      }

      const existDeletedSubCategories = data.some((subCategory) => subCategory.deleted)

      if (existDeletedSubCategories) {
         const nonDeletedSubCategories = getNonDeletedSubCategories(data)
         setSubCategories(nonDeletedSubCategories)
         return
      }

      setSubCategories(data)
   }, [data])

   return (
      <>
         <Box display='flex' justifyContent='space-between'>
            <Typography variant='h2' fontSize='25px' fontWeight='bold'>
               Sub-Categorías
            </Typography>
            <Button
               onClick={toggleSubCategoryModal}
               variant='contained'
               color={!openSubCategoryModal.open ? 'primary' : 'secondary'}
               sx={{ width: 'fit-content' }}
            >
               Añadir nueva SubCategoría
            </Button>
         </Box>
         <Modal open={openSubCategoryModal.open}>
            <SubCategory
               data={openSubCategoryModal.subCategory}
               onUpdate={onUpdate}
               onSave={onSave}
               onClose={toggleSubCategoryModal}
            />
         </Modal>
         <DataTable
            columns={subCategoriesColumns}
            rows={subCategories}
            noRowsDescription='No se han creado Sub Categorías'
            density='compact'
            hideToolbar
            hideFooter
            {...props}
         />
      </>
   )
}

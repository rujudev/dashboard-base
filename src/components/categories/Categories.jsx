import { useState } from 'react'

// Material UI components
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'

// Custom components
import ActionButtonsCell from '../table/ActionButtonsCell'
import DataTable from '../table/DataTable'

import { NO_IMAGE_URL } from '../../constants'
import Modal from '../modals/Modal'
import { Box, Button, Typography } from '@mui/material'
import { modalActions } from '../../constants/modal-actions'

export default function Categories({ data, onUpdate, onRemove }) {
   const [openRemoveModal, setOpenRemoveModal] = useState({
      open: false,
      category: null,
   })

   const [isChangingActiveLoading, setIsChangingActiveLoading] = useState({
      id: 0,
      loading: false,
   })

   const handleRemove = (categoryId) => {
      toggleRemoveModal()
      onRemove(categoryId)
   }

   const handleChangeActiveCategory = async (event, categoryId) => {
      const { checked } = event.target

      await onUpdate(checked, categoryId)
      setIsChangingActiveLoading({ categoryId, loading: false })
   }

   const toggleRemoveModal = (params) => {
      const category = params?.category ?? null

      setOpenRemoveModal((prevOpenRemoveModal) => ({
         open: !prevOpenRemoveModal.open,
         category,
      }))
   }

   const columns = [
      {
         field: 'isActive',
         headerName: 'Activa',
         width: 100,
         renderCell: (params) => {
            const { row } = params
            const { id, isActive } = row

            return (
               <>
                  {isChangingActiveLoading.id === id && isChangingActiveLoading.loading ? (
                     <CircularProgress />
                  ) : (
                     <Checkbox
                        checked={isActive}
                        onChange={(event) => {
                           setIsChangingActiveLoading({ id, loading: true })
                           handleChangeActiveCategory(event, id)
                        }}
                     />
                  )}
               </>
            )
         },
      },
      {
         field: 'thumbnail',
         headerName: 'Imágen Principal',
         width: 150,
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
      { field: 'name', headerName: 'Nombre', flex: 1 },
      {
         field: 'subCategories',
         headerName: 'Subcategorías',
         width: 150,
         valueGetter: ({ value }) => value?.length ?? 0,
      },
      {
         field: 'voucherCode',
         headerName: 'Código Dto',
         width: 150,
         renderCell: (params) => {
            const { value } = params
            const { isActiveInCategory, code } = value

            return (
               <>
                  {code && (
                     <Badge
                        color={isActiveInCategory ? 'success' : 'error'}
                        variant='dot'
                        sx={{
                           paddingRight: 2,
                           '& .MuiBadge-badge': {
                              right: -3,
                              top: 11,
                           },
                        }}
                     >
                        {code}
                     </Badge>
                  )}
               </>
            )
         },
      },
      {
         field: 'action',
         headerName: '',
         pinnable: true,
         align: 'center',
         sortable: false,
         type: 'actions',
         renderCell: ({ row }) => {
            const { id, name } = row

            return (
               <>
                  <ActionButtonsCell
                     itemId={id}
                     page='categories'
                     onOpenModal={(action) => {
                        if (action === modalActions.REMOVE) {
                           toggleRemoveModal({ category: row })
                        }
                     }}
                     editButton
                     removeButton
                     hideButtonText={false}
                  />
                  {openRemoveModal.category?.id === id && (
                     <Modal open={openRemoveModal.open} onClose={toggleRemoveModal}>
                        <Typography variant='h5'>Eliminar categoría</Typography>
                        <Typography variant='subtitle1'>
                           ¿Estás seguro de eliminar la categoría <b>&lsquo;{name}&rsquo;</b>
                        </Typography>
                        <Box display='flex' width='100%' justifyContent='end'>
                           <Button onClick={toggleRemoveModal}>Cancelar</Button>
                           <Button onClick={() => handleRemove(openRemoveModal.category.id)}>Eliminar</Button>
                        </Box>
                     </Modal>
                  )}
               </>
            )
         },
      },
   ]

   return <DataTable columns={columns} rows={data} noRowsDescription='No hay categorias registradas' />
}

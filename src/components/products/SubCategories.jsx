import { useState, useCallback, useEffect } from 'react'

// Material UI Components
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Zoom from '@mui/material/Zoom'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import MuiSelect from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import CancelIcon from '@mui/icons-material/Cancel'

// Custom Components
import Modal from '../modals/Modal'
import ActionButtonsCell from '../table/ActionButtonsCell'
import TransferList from '../TransferList'
import DataTable from '../table/DataTable'
import { modalActions } from '../../constants/modal-actions'

export default function ProductSubCategories({ gridArea, category, subCategories, onUpdate }) {
   const [selectedSubCategories, setSelectedSubCategories] = useState([])
   const [productSubCategories, setProductSubCategories] = useState([])
   const [openSelect, setOpenSelect] = useState(false)
   const [openAddSubCategories, setOpenAddSubCategories] = useState(false)
   const [openModal, setOpenModal] = useState({
      open: false,
      action: '',
   })
   const [selectedSubCategoryTags, setSelectedSubCategoryTags] = useState({
      subCategory: {
         id: '',
         name: '',
      },
      unselectedTags: [],
      selectedTags: [],
   })

   const toggleOpenModal = (action) => {
      setOpenModal((prevOpenModal) => ({
         ...prevOpenModal,
         open: !prevOpenModal.open,
         ...(action && { action }),
      }))
   }

   const handleChangeSubCategoryTags = (subCategory) => {
      if (!subCategory) return

      const { id, name } = subCategory

      if (id) {
         const categorySubCategoryTags = category.subCategories.find((subCategory) => subCategory.id === id)?.tags

         const selectedTags = productSubCategories.find((subCategory) => subCategory.id === id)?.tags
         const unselectedTags = getUnselectedItems(categorySubCategoryTags, selectedTags)

         setSelectedSubCategoryTags({
            subCategory: {
               id,
               name,
            },
            unselectedTags,
            selectedTags,
         })
      }
   }

   const handleRemoveSubCategory = (subCategoryId) => {
      setProductSubCategories((prevProductSubCategories) => {
         const nonDeletedProductSubCategories = prevProductSubCategories.filter(
            (subCategory) => subCategory.id !== subCategoryId
         )

         onUpdate(nonDeletedProductSubCategories)
         return nonDeletedProductSubCategories
      })

      toggleOpenModal()
   }

   const handleSaveProductSubCategoryTagsChanges = (id, selected) => {
      setProductSubCategories((prevProductSubCategories) => {
         const updatedProductSubCategories = prevProductSubCategories.map((productSubCategory) => {
            let newProductSubCategory = { ...productSubCategory }

            if (productSubCategory.id === id) {
               newProductSubCategory = {
                  ...newProductSubCategory,
                  tags: selected,
               }
            }

            return newProductSubCategory
         })

         onUpdate(updatedProductSubCategories)
         return updatedProductSubCategories
      })

      toggleOpenModal()
   }

   useEffect(() => {
      setProductSubCategories(subCategories)
   }, [])

   const columns = [
      {
         field: 'name',
         headerName: 'Sub categorías',
         width: 250,
         renderCell: ({ row }) => {
            const url = row.thumbnail?.url
            const src =
               url && !url.includes('blob') ? row.thumbnail.url : 'https://via.placeholder.com/150?text=No Image'
            const alt = row.thumbnail?.name ? row.thumbnail.name : 'no thumbnail assigned'

            return (
               <Chip
                  avatar={
                     <Avatar
                        src={src}
                        alt={alt}
                        sx={{ width: 30, height: 30, '& .MuiAvatar-img': { objectFit: 'contain' } }}
                     />
                  }
                  label={row.name}
                  sx={{ backgroundColor: 'transparent' }}
               />
            )
         },
      },
      {
         field: 'tags',
         headerName: 'Etiquetas',
         flex: 1,
         wrapText: true,
         autoHeight: true,
         renderCell: (params) => {
            const { row } = params
            const { id: subCategoryId, tags } = row

            return (
               <Box display='flex' flexWrap='wrap' gap={1} py={1} height='100%'>
                  {tags &&
                     tags.map((tag) => {
                        const url = tag.thumbnail?.url
                        const src = url && !url.includes('blob') ? url : 'https://via.placeholder.com/150?text=No Image'
                        const tagName = tag.name ? tag.name : 'no thumbnail assigned'

                        return (
                           <Chip
                              key={tag.id}
                              avatar={
                                 <Avatar
                                    src={src}
                                    alt={tagName}
                                    sx={{ width: 30, height: 30, '& .MuiAvatar-img': { objectFit: 'contain' } }}
                                 />
                              }
                              label={tagName}
                              onDelete={() => handleRemoveTagFromSubCategory(subCategoryId, tag.id)}
                              sx={{}}
                           />
                        )
                     })}
               </Box>
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
         renderCell: ({ id, row }) => {
            return (
               <>
                  <ActionButtonsCell
                     itemId={id}
                     editButton
                     removeButton
                     hideMenuButton
                     onOpenModal={(action) => {
                        toggleOpenModal(action)
                        handleChangeSubCategoryTags(row)
                     }}
                  />
                  <Modal open={openModal.open && openModal.action === modalActions.REMOVE}>
                     <Typography variant='h5'>
                        Eliminar sub categoría{' '}
                        <b>
                           <i>{selectedSubCategoryTags.subCategory.name}</i>
                        </b>
                     </Typography>
                     <Typography variant='subtitle1'>
                        ¿Está seguro de eliminar esta sub categoría del producto?
                     </Typography>
                     <Box display='flex' width='100%' justifyContent='end' gap={2}>
                        <Button onClick={toggleOpenModal}>Cancelar</Button>
                        <Button
                           variant='contained'
                           color='error'
                           onClick={() => handleRemoveSubCategory(selectedSubCategoryTags.subCategory.id)}
                        >
                           Eliminar
                        </Button>
                     </Box>
                  </Modal>
                  <Modal open={openModal.open && openModal.action === modalActions.EDIT}>
                     <TransferList
                        id={selectedSubCategoryTags.subCategory.id}
                        title={
                           <>
                              Etiquetas de{' '}
                              <b>
                                 <i>{selectedSubCategoryTags.subCategory.name}</i>
                              </b>
                           </>
                        }
                        unselectedItems={selectedSubCategoryTags.unselectedTags}
                        selectedItems={selectedSubCategoryTags.selectedTags}
                        onUpdate={handleSaveProductSubCategoryTagsChanges}
                        onClose={toggleOpenModal}
                     />
                  </Modal>
               </>
            )
         },
      },
   ]

   const getUnselectedItems = (leftList, rightList) => {
      if (!Array.isArray(leftList) || !Array.isArray(rightList)) return []
      if (leftList.length === rightList.length) return []

      const leftIds = leftList.map((item) => item.id)
      const rightIds = rightList.map((item) => item.id)
      let newLeftList = []

      for (const leftId of leftIds) {
         if (!rightIds.includes(leftId)) {
            const item = leftList.find((item) => item.id === leftId)
            newLeftList = [...newLeftList, item]
         }
      }

      return newLeftList
   }

   const handleSelectSubCategories = (event) => {
      const { value: subCategories } = event.target

      setSelectedSubCategories(subCategories)
   }

   const handleSaveSelectedSubCategories = () => {
      if (selectedSubCategories.length === 0) return

      let newProductSubCategories = []

      for (const subCategoryId of selectedSubCategories) {
         const subCategory = category.subCategories.find((category) => category.id === subCategoryId)

         if (subCategory) {
            newProductSubCategories = [...newProductSubCategories, subCategory]
         }
      }

      if (productSubCategories.length > 0) {
         newProductSubCategories = [...newProductSubCategories, ...productSubCategories]
      }

      setProductSubCategories(newProductSubCategories)
      onUpdate(newProductSubCategories)
      setSelectedSubCategories([])
      toggleAddSubCategories()
   }

   const isSelectedSubCategory = useCallback(
      (subCategory) => {
         if (selectedSubCategories.length > 0 && selectedSubCategories.includes(subCategory.id)) {
            return true
         }

         if (productSubCategories.length > 0) {
            for (const productSubCategory of productSubCategories) {
               if (productSubCategory.id === subCategory.id) {
                  return true
               }
            }
         }

         return false
      },
      [openSelect, selectedSubCategories, productSubCategories]
   )

   const handleRemoveTagFromSubCategory = (subCategoryId, tagId) => {
      setProductSubCategories((prevProductSubCategories) => {
         const newProductSubCategories = [...prevProductSubCategories]
         let subCategory = newProductSubCategories.find((subCategory) => subCategory.id === subCategoryId)
         const subCategoryTags = subCategory.tags.filter((tag) => tag.id !== tagId)

         subCategory = {
            ...subCategory,
            tags: subCategoryTags,
         }

         for (let i = 0; i < newProductSubCategories.length; i++) {
            if (newProductSubCategories[i].id === subCategory.id) {
               newProductSubCategories.splice(i, 1, subCategory)
            }
         }

         onUpdate(newProductSubCategories)
         return newProductSubCategories
      })
   }

   const toggleAddSubCategories = () => {
      setOpenAddSubCategories(!openAddSubCategories)
   }

   const isAllSubCategoriesSaved = productSubCategories.length === category.subCategories.length

   const ITEM_HEIGHT = 48
   const ITEM_PADDING_TOP = 8

   return (
      <Box gridArea={gridArea} display='flex' flexDirection='column' gap={2}>
         <Box display='flex' width='100%' justifyContent='space-between' alignItems='center'>
            <Typography variant='h6' fontWeight='bold'>
               Categoría <i>{`"${category.name}"`}</i> seleccionada
            </Typography>
            {!openAddSubCategories ? (
               <Tooltip
                  TransitionComponent={Zoom}
                  title={isAllSubCategoriesSaved ? 'No hay mas subcategorías para añadir' : ''}
                  placement='bottom'
               >
                  <Box component='span' sx={{ cursor: isAllSubCategoriesSaved ? 'not-allowed' : 'default' }}>
                     <Button
                        variant='contained'
                        color='primary'
                        onClick={toggleAddSubCategories}
                        disabled={isAllSubCategoriesSaved}
                     >
                        Añadir subcategorías
                     </Button>
                  </Box>
               </Tooltip>
            ) : (
               <Box display='flex' justifyContent='center' gap={2}>
                  <Tooltip
                     TransitionComponent={Zoom}
                     title={selectedSubCategories.length === 0 ? 'No se han realizado cambios' : ''}
                     placement='bottom'
                  >
                     <Box
                        component='span'
                        sx={{ cursor: selectedSubCategories.length === 0 ? 'not-allowed' : 'default' }}
                     >
                        <Button
                           color='success'
                           onClick={handleSaveSelectedSubCategories}
                           variant='contained'
                           startIcon={<AddCircleIcon />}
                           disabled={selectedSubCategories.length === 0}
                        >
                           Añadir
                        </Button>
                     </Box>
                  </Tooltip>
                  <Button color='error' variant='contained' startIcon={<CancelIcon />} onClick={toggleAddSubCategories}>
                     Cancelar
                  </Button>
               </Box>
            )}
         </Box>
         <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='space-around'
            width='100%'
            gap={1}
         >
            {openAddSubCategories && (
               <FormControl sx={{ m: 1, width: '100%' }}>
                  <InputLabel id='demo-multiple-checkbox-label'>Selecciona sub categorías</InputLabel>
                  <MuiSelect
                     label='Selecciona sub categorías'
                     labelId='sub-categories'
                     id='sub-categories-multiple-checkbox'
                     value={selectedSubCategories}
                     onChange={handleSelectSubCategories}
                     onOpen={() => setOpenSelect((prevOpenSelect) => !prevOpenSelect)}
                     renderValue={(selected) => (
                        <Box display='flex' flexWrap='wrap' gap={0.5}>
                           {selected.map((subCategoryId) => {
                              const subCategory = category.subCategories.find(
                                 (subCategory) => subCategory.id === subCategoryId
                              )

                              return <Chip key={subCategory.id} label={subCategory.name} />
                           })}
                        </Box>
                     )}
                     MenuProps={{
                        PaperProps: {
                           style: {
                              maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                              width: 250,
                           },
                        },
                     }}
                     fullWidth
                     multiple
                  >
                     {category.subCategories.map((subCategory) => (
                        <MenuItem
                           key={subCategory.id}
                           value={subCategory.id}
                           disabled={isSelectedSubCategory(subCategory)}
                        >
                           <Checkbox
                              checked={isSelectedSubCategory(subCategory)}
                              disabled={isSelectedSubCategory(subCategory)}
                           />
                           <ListItemText primary={subCategory.name} />
                        </MenuItem>
                     ))}
                  </MuiSelect>
               </FormControl>
            )}
            <Box width='100%'>
               <DataTable
                  columns={columns}
                  getRowHeight={() => 'auto'}
                  rows={productSubCategories}
                  noRowsDescription='Ninguna sub categoría asignada'
                  hideToolbar
                  hideFooter
               />
            </Box>
         </Box>
      </Box>
   )
}

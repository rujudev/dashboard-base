import { useEffect, useState } from 'react'
import { Form } from 'react-router-dom'

// Material UI components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// Material UI Icons
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'

// Custom components
import Tags from './tags/Tags'
import Thumbnail from '../../image/Thumbnail'

export default function SubCategory({ data, onSave, onUpdate, onClose }) {
   const [id, setId] = useState(null)
   const [name, setName] = useState('')
   const [thumbnail, setThumbnail] = useState(null)
   const [tags, setTags] = useState([])
   const [isUpdating, setIsUpdating] = useState(false)

   const handleRemoveTag = (id) => {
      setTags((prevTags) => {
         return prevTags.filter((tag) => tag.id !== id)
      })
   }

   const handleSave = () => {
      const newSubCategory = {
         id: new Date().getTime() + Math.floor(Math.random() * 10000),
         name,
         thumbnail,
         tags,
      }

      onSave(newSubCategory)
      onClose()
   }

   const handleUpdate = () => {
      const updatedSubCategory = {
         id,
         name,
         thumbnail,
         tags,
      }

      onUpdate(updatedSubCategory)
      onClose()
   }

   const handleChangeSubCategoryName = (event) => {
      const { value } = event.target
      setName(value)
   }

   const handleSelectSubCategoryThumbnail = (event) => {
      const file = event.target.files[0]

      const fileName = file.name
      const fileURL = URL.createObjectURL(file)
      const newThumbnail = { file, name: fileName, url: fileURL }

      setThumbnail(newThumbnail)
   }

   const handleRemoveSubCategoryThumbnail = () => {
      setThumbnail(null)
   }

   const handleSaveTag = (tag) => {
      if (!tag) return

      setTags((prevTags) => [...prevTags, tag])
   }

   const handleUpdateTag = (tag) => {
      setTags((prevTags) => {
         let tagFound = prevTags.find((tagItem) => tagItem.id === tag.id)

         if (tagFound) {
            tagFound = {
               ...tagFound,
               ...tag,
            }

            const tagIndex = prevTags.findIndex((prevTag) => prevTag.id === tagFound.id)
            const newTags = [...prevTags]
            newTags.splice(tagIndex, 1, tagFound)

            return newTags
         }

         return prevTags
      })
   }

   useEffect(() => {
      if (!data) return

      const dataId = data?.id ?? null
      const dataName = data?.name ?? ''
      const dataThumbnail = data?.thumbnail ?? null
      const dataTags = data?.tags ?? []

      setId(dataId)
      setName(dataName)
      setThumbnail(dataThumbnail)
      setTags(dataTags)
   }, [data])

   useEffect(() => {
      const dataName = data?.name ?? ''
      const dataThumbnail = data?.thumbnail ?? null
      const dataTags = data?.tags ?? []

      const isSameName = name && dataName === name
      const isSameThumbnail = thumbnail && dataThumbnail.url === thumbnail.url && dataThumbnail.name === thumbnail.name
      const isSameTags = checkTagsEquality(dataTags, tags)

      setIsUpdating(!isSameName || !isSameThumbnail || !isSameTags)
   }, [name, thumbnail, tags])

   const checkTagsEquality = (tags1, tags2) => {
      if (tags1.length !== tags2.length) return false

      for (let i = 0; i < tags1.length; i++) {
         const tag1 = tags1[i]
         const tag2 = tags2.find((tag) => tag.id === tag1.id)

         if (!tag2) return false
         if (tag1.name !== tag2.name) return false

         if (tag1.thumbnail?.name !== tag2.thumbnail?.name) return false
      }

      return true
   }

   return (
      <Box display='flex' flexDirection='column' gap={2}>
         <Box display='flex' justifyContent='space-between' alignItems='center' width='100%'>
            <Typography variant='h6' fontWeight='bold'>
               {!id ? 'Nueva' : 'Editar'} Subcategoría
            </Typography>

            <Box display='flex' gap={2}>
               <Button
                  startIcon={<SaveIcon />}
                  onClick={!id ? handleSave : handleUpdate}
                  variant='contained'
                  color='success'
                  disabled={!isUpdating}
               >
                  {!id ? 'Guardar' : 'Actualizar'}
               </Button>
               <Button startIcon={<CancelIcon />} onClick={onClose} variant='contained' color='error'>
                  Cancelar
               </Button>
            </Box>
         </Box>
         <Box component={Form} display='flex' flexDirection='column' width='100%' gap={2}>
            <Box display='flex' gap={2}>
               <Box display='flex' flexDirection='column' justifyContent='space-around'>
                  <TextField
                     label='Nombre'
                     value={name || ''}
                     onChange={handleChangeSubCategoryName}
                     sx={{ minWidth: '100px' }}
                  />
               </Box>
               <Thumbnail
                  url={thumbnail?.url}
                  name={thumbnail?.name}
                  onChange={handleSelectSubCategoryThumbnail}
                  onRemove={handleRemoveSubCategoryThumbnail}
               />
            </Box>
            <Divider variant='middle' />
            <Tags data={tags} onUpdate={handleUpdateTag} onSave={handleSaveTag} onRemove={handleRemoveTag} />
         </Box>
      </Box>
   )
}

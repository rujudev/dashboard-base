import { useEffect, useState } from 'react'

// Material UI components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// Material UI Icons
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'

// Custom components
import Thumbnail from '../../../image/Thumbnail'

export default function Tag({ data, onUpdate, onSave, onClose }) {
   const [id, setId] = useState(null)
   const [name, setName] = useState('')
   const [thumbnail, setThumbnail] = useState(null)
   const [isUpdating, setIsUpdating] = useState(false)

   const handleSave = () => {
      const newTag = {
         id: new Date().getTime() + Math.floor(Math.random() * 10000),
         name,
         thumbnail,
      }

      onSave(newTag)
      onClose()
   }

   const handleUpdate = () => {
      const updatedTag = {
         id,
         name,
         thumbnail,
      }

      onUpdate(updatedTag)
      onClose()
   }

   const handleChangeTagName = (event) => {
      const { value } = event.target
      setName(value)
   }

   const handleSelectTagThumbnail = async (event) => {
      const file = event.target.files[0]

      const fileName = file.name
      const fileURL = URL.createObjectURL(file)
      const newThumbnail = { file, name: fileName, url: fileURL }

      setThumbnail(newThumbnail)
   }

   const handleRemoveTagThumbnail = () => {
      setThumbnail(null)
   }

   useEffect(() => {
      const dataId = data?.id ?? null
      const dataName = data?.name ?? ''
      const dataThumbnail = data?.thumbnail ?? null

      setId(dataId)
      setName(dataName)
      setThumbnail(dataThumbnail)
   }, [data])

   useEffect(() => {
      if (!data) {
         setIsUpdating(name && thumbnail)
         return
      }

      const dataName = data?.name ?? ''
      const dataThumbnail = data?.thumbnail ?? null

      const isSameName = name && dataName === name
      const isSameThumbnail = thumbnail && dataThumbnail.url === thumbnail.url && dataThumbnail.name === thumbnail.name

      setIsUpdating(!isSameName || !isSameThumbnail)
   }, [name, thumbnail])

   return (
      <Box display='flex' flexDirection='column' gap={2}>
         <Box display='flex' justifyContent='space-between' gap={2}>
            <Typography variant='h6' fontWeight='bold'>
               {!id ? 'Nueva etiqueta' : 'Editar etiqueta'}
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
         <Box display='grid' gridTemplateColumns='1fr 1fr' gap={2}>
            <Box>
               <TextField label='Nombre de la etiqueta' value={name || ''} onChange={handleChangeTagName} fullWidth />
            </Box>
            <Box>
               <Thumbnail
                  url={thumbnail?.url}
                  name={thumbnail?.name}
                  onChange={handleSelectTagThumbnail}
                  onRemove={handleRemoveTagThumbnail}
               />
            </Box>
         </Box>
      </Box>
   )
}

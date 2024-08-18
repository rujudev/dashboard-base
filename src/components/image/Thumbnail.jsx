import { useEffect, useRef, useState } from 'react'

import InputUnstyled from '@mui/material/InputBase'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CollectionsOutlined from '@mui/icons-material/CollectionsOutlined'

import { NO_IMAGE_URL } from '../../constants'

export default function Thumbnail({ url, name, onChange, onRemove, width, height, orientation = 'horizontal' }) {
   const inputFileRef = useRef(null)
   const [thumbnail, setThumbnail] = useState(null)
   const isHorizontal = orientation === 'horizontal'

   const handleOpenSelectFile = () => {
      inputFileRef.current.click()
   }

   const handleSelectImage = (event) => {
      onChange(event)
   }

   const handleRemoveImg = () => {
      setThumbnail(null)
      onRemove()
   }

   useEffect(() => {
      if (url && name) {
         setThumbnail({
            url,
            name,
         })
      }
   }, [url, name])

   return (
      <Box
         display='flex'
         alignItems='center'
         border='1px rgb(218, 225, 231) dashed'
         borderRadius='10px'
         width='max-content'
         height='max-content'
         padding={2}
         gap={1}
         {...(orientation === 'vertical' && { flexDirection: 'column' })}
      >
         <img
            src={thumbnail?.url || NO_IMAGE_URL}
            alt={thumbnail?.name || 'No Thumbnail assigned'}
            width={isHorizontal ? 100 : 185}
            height={isHorizontal ? 100 : 185}
         />
         <InputUnstyled
            id='file-upload'
            name='images'
            type='file'
            onChange={handleSelectImage}
            slotProps={{
               input: {
                  ref: inputFileRef,
                  accept: 'image/*',
                  multiple: true,
                  style: {
                     display: 'none',
                  },
               },
            }}
         />
         <Box display='flex' flexDirection='column' gap={isHorizontal ? 3 : 2}>
            <Button
               startIcon={<CollectionsOutlined />}
               onClick={handleOpenSelectFile}
               variant='contained'
               color={thumbnail ? 'secondary' : 'info'}
               sx={{ height: 'fit-content' }}
            >
               {thumbnail ? 'Cambiar imagen' : 'Subir imagen'}
            </Button>
            {thumbnail && (
               <Button
                  startIcon={<CollectionsOutlined />}
                  onClick={handleRemoveImg}
                  variant='contained'
                  color='error'
                  sx={{ height: 'fit-content' }}
               >
                  {thumbnail && 'Eliminar imagen'}
               </Button>
            )}
         </Box>
      </Box>
   )
}

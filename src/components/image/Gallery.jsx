import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import IconButton from '@mui/material/IconButton'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'

import { useDropzone } from 'react-dropzone'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import DeleteRounded from '@mui/icons-material/DeleteRounded'

export function ImageGallery({ data, onDrop, onSelectImage, onSelectThumbnail, onDelete, maxListSize = 6, ...props }) {
   const { getRootProps, getInputProps } = useDropzone({
      accept: {
         'image/*': ['.jpeg', '.jpg', '.png'],
      },
      maxFiles: maxListSize,
      noClick: true,
      onDrop,
   })

   return (
      <Box display='flex' flexDirection='column' gap={2}>
         <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            border='1px rgb(218, 225, 231) dashed'
            borderRadius='15px'
            padding='25px'
         >
            <Box display='flex' justifyContent='center' width='100%' {...getRootProps()}>
               <input {...getInputProps()} disabled={data.length >= maxListSize} />
               <Box display='flex' flexDirection='column' alignItems='center'>
                  <Typography variant='subtitle1' color='rgb(150, 150, 150)'>
                     Arrastra tus imágenes aquí
                  </Typography>
                  <Typography component='p' variant='subtitle1' color='rgb(185, 185, 185)' marginBottom='10px'>
                     o
                  </Typography>
               </Box>
            </Box>
            <InputLabel htmlFor='file-upload'>
               <input
                  id='file-upload'
                  type='file'
                  accept='image/*'
                  onChange={data.length <= maxListSize ? onSelectImage : null}
                  style={{ display: 'none' }}
                  multiple
               />
               <Button
                  color='primary'
                  aria-label='add'
                  component='span'
                  variant='outlined'
                  disabled={data.length >= maxListSize}
               >
                  Seleccionar Archivos
               </Button>
            </InputLabel>
         </Box>
         {data.length > 0 ? (
            <ImageList
               name='image-gallery'
               sx={{
                  width: '100%',
                  gridTemplateColumns: 'repeat(auto-fit, 200px)',
               }}
            >
               {data
                  .filter((img) => !img?.isDeleted)
                  .map((img, index) => {
                     return (
                        <ImageListItem
                           key={`${index}-${img.name}`}
                           sx={{
                              '&:hover': {
                                 cursor: 'pointer',
                              },
                              '&:hover .MuiImageListItemBar-root': {
                                 display: 'flex',
                              },
                              '& .MuiImageListItem-img': {
                                 height: '100%',
                                 maxHeight: '200px',
                              },
                              '&:hover .MuiButtonGroup-root': {
                                 display: 'flex',
                              },
                           }}
                        >
                           <img key={`img-gallery-${index}`} src={img.url} alt={`imagen galeria número ${index}`} />
                           <ImageListItemBar
                              position='top'
                              actionPosition='left'
                              actionIcon={
                                 <ButtonGroup sx={{ display: 'none', gap: '8px', padding: '8px' }}>
                                    <IconButton onClick={() => onSelectThumbnail(img.id)}>
                                       <StarRoundedIcon
                                          sx={{
                                             color: img.isThumbnail ? '#faaf00' : '#fff',
                                             '&:hover': {
                                                fill: '#faaf00',
                                             },
                                          }}
                                       />
                                    </IconButton>
                                    <IconButton aria-label='delete-image' onClick={() => onDelete(img.id)}>
                                       <DeleteRounded
                                          sx={{
                                             color: 'white',
                                             '&:hover': {
                                                fill: 'red',
                                             },
                                          }}
                                       />
                                    </IconButton>
                                 </ButtonGroup>
                              }
                              sx={{
                                 display: 'none',
                                 width: '100%',
                                 height: '45px',
                              }}
                           />
                        </ImageListItem>
                     )
                  })}
            </ImageList>
         ) : (
            <Box
               display='flex'
               justifyContent='center'
               padding='25px'
               border='1px rgb(218, 225, 231) dotted'
               borderRadius='10px'
            >
               <Typography variant='subtitle1' color='rgb(150, 150, 150)'>
                  Sin imágenes añadidas.
               </Typography>
            </Box>
         )}
      </Box>
   )
}

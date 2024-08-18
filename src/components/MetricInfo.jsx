import { InfoOutlined } from '@mui/icons-material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import {
   Avatar,
   Backdrop,
   Box,
   Button,
   Fade,
   IconButton,
   List,
   ListItem,
   ListItemAvatar,
   ListItemIcon,
   ListItemText,
   Modal,
   Popover,
   Typography,
   useTheme,
} from '@mui/material'
import { useState } from 'react'
import ActionButtons from './table/ActionButtons'

export default function MetricInfo({ data, anchorEl, open, onChangeOpen, onChangeClose, onChangeHide, iconColor }) {
   const theme = useTheme()
   const [openModal, setOpenModal] = useState({
      open: false,
      action: '',
      item: null,
   })

   const handleOpenModal = (action, item) => {
      onChangeClose()
      setOpenModal({
         open: true,
         action,
         item,
      })
   }

   const handleCloseModal = () => {
      setOpenModal({
         open: false,
         action: '',
         item: null,
      })
   }

   const handleChangeHide = (id) => {
      onChangeHide(id)
      handleCloseModal()
   }

   return (
      <>
         <IconButton aria-describedby='no-stock-popover' variant='contained' onClick={onChangeOpen}>
            <InfoOutlined sx={{ fill: iconColor }} />
         </IconButton>
         <Popover
            id='no-stock-popover'
            open={open}
            anchorEl={anchorEl}
            onClose={onChangeClose}
            anchorOrigin={{
               vertical: 'bottom',
               horizontal: 'left',
            }}
         >
            <List>
               {data.map((item) => (
                  <ListItem key={item?.id} sx={{ padding: '8px', gap: 1 }}>
                     <ListItemAvatar sx={{ minWidth: 'max-content' }}>
                        <Avatar
                           src={item.thumbnail?.url || 'https://via.placeholder.com/150'}
                           sx={{ '& .MuiAvatar-img': { objectFit: 'contain' } }}
                        />
                     </ListItemAvatar>
                     <Box display='flex' justifyContent='space-between' alignItems='center' width='100%' gap={2}>
                        <ListItemText primary={item.name} />
                        <ListItemIcon sx={{ minWidth: 'unset' }}>
                           <ActionButtons
                              itemId={item.id}
                              page='products'
                              editButton
                              editButtonText={false}
                              hideButton
                              hideIcon={<VisibilityIcon />}
                              hideButtonText={false}
                              orientation='horizontal'
                              onOpenModal={(action) => handleOpenModal(action, item)}
                           />
                        </ListItemIcon>
                     </Box>
                  </ListItem>
               ))}
            </List>
         </Popover>
         <Modal
            open={openModal.open}
            onClose={handleCloseModal}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
               root: {
                  style: {
                     display: 'flex',
                     justifyContent: 'center',
                     alignItems: 'center',
                  },
               },
            }}
         >
            <Fade in={openModal.open}>
               <Box
                  display='flex'
                  flexDirection='column'
                  width='max-content'
                  rowGap={2}
                  sx={{
                     bgcolor: theme.palette.background.paper,
                     zIndex: 1200,
                     padding: 2,
                  }}
               >
                  <Typography variant='h5'>Ocultar producto</Typography>
                  <Typography variant='subtitle1'>
                     {`¿Desea volver a mostrar el producto ${openModal.item?.name} en la web?`}
                  </Typography>
                  <Box display='flex' width='100%' justifyContent='end'>
                     <Button onClick={handleCloseModal}>Cancelar</Button>
                     <Button onClick={() => handleChangeHide(openModal.item?.id)}>Mostrar</Button>
                  </Box>
               </Box>
            </Fade>
         </Modal>
      </>
   )
}

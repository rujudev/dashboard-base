import { Box, Button, Typography } from '@mui/material'

import Modal from './Modal'

export default function ConfirmCancelModal({ open, title, onConfirm, onCancel }) {
   return (
      <Modal open={open} aria-labelledby='modal-title' aria-describedby='modal-description'>
         <Box display='flex' flexDirection='column' gap={2}>
            <Typography id='modal-title' variant='h6' component='h2'>
               {title}
            </Typography>
            <Box display='flex' width='100%' justifyContent='end' gap={2}>
               <Button onClick={onConfirm}>Confirmar</Button>
               <Button onClick={onCancel} variant='contained' color='error'>
                  Cancelar
               </Button>
            </Box>
         </Box>
      </Modal>
   )
}

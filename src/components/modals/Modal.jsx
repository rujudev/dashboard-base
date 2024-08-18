import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import MuiModal from '@mui/material/Modal'

export default function Modal({ children, open, width, ...otherModalProps }) {
   return (
      <MuiModal
         aria-labelledby='modal-title'
         aria-describedby='modal-description'
         open={open}
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
            backdrop: {
               timeout: 500,
            },
         }}
         {...otherModalProps}
      >
         <Fade in={open}>
            <Box
               sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: width || 650,
                  bgcolor: 'background.paper',
                  boxShadow: 24,
                  p: 2,
               }}
            >
               {children}
            </Box>
         </Fade>
      </MuiModal>
   )
}

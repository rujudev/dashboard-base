import Box from '@mui/material/Box'
import FormGroup from '@mui/material/FormGroup'
import InputLabel from '@mui/material/InputLabel'
import Paper from '@mui/material/Paper'

export default function OptionsToolbar({ options = [], ...boxProps }) {
   return (
      <Box {...boxProps}>
         <Paper sx={{ paddingX: 2, paddingY: 3, position: 'relative', width: '100%' }}>
            <Box position='absolute' top='-12%' backgroundColor='rgba(255, 255, 255, 1)'>
               <InputLabel sx={{ paddingX: 1 }}>Opciones</InputLabel>
            </Box>
            <FormGroup row sx={{ gap: 2 }}>
               {options}
            </FormGroup>
         </Paper>
      </Box>
   )
}

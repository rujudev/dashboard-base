import { Link } from 'react-router-dom'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import MuiButton from '@mui/material/Button'

export default function Button({ to, color, icon, text, ...props }) {
   return (
      <MuiButton
         display='flex'
         LinkComponent={Link}
         to={to}
         color={color}
         sx={{
            display: 'flex',
            border: 'unset',
            justifyContent: 'start',
            gap: 1,
            '&:hover': {
               border: 'unset',
            },
         }}
         {...props}
      >
         <Box display='flex'>{icon}</Box>
         {text && <Typography variant='button'>{text}</Typography>}
      </MuiButton>
   )
}

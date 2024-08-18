import { Typography } from '@mui/material'
import MuiInputAdornment from '@mui/material/InputAdornment'
import React from 'react'

export default function InputAdornment({ currency, position }) {
   return (
      <MuiInputAdornment position={position}>
         <Typography variant='subtitle1' color='rgb(150, 150, 150)'>
            {currency}
         </Typography>
      </MuiInputAdornment>
   )
}

import { Add } from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export default function ParentHeader({ PageIcon, title, buttonText, buttonGridArea, buttonToPath }) {
   return (
      <>
         <Box gridArea='page-name' display='flex' alignItems='center' paddingBottom={1}>
            <PageIcon sx={{ fill: '#D23F57', marginRight: '0.4rem', width: '1.5em', height: '1.5em' }} />
            <Typography component='h4' variant='h4' fontWeight='bold' lineHeight='normal'>
               {title}
            </Typography>
         </Box>
         <Box gridArea={buttonGridArea}>
            <Button variant='contained' LinkComponent={Link} to={buttonToPath}>
               <Add sx={{ marginRight: '0.4rem' }} />
               <Typography component='h4' variant='inherit' lineHeight='normal'>
                  {buttonText}
               </Typography>
            </Button>
         </Box>
      </>
   )
}

import { Avatar, Box, Container, Typography } from '@mui/material'
import { useEffect } from 'react'

export default function AuthWidget({ children, title, handleSubmit }) {
   useEffect(() => {}, [])

   return (
      <Box
         display='flex'
         flexDirection='column'
         alignItems='center'
         justifyContent='center'
         height='100%'
         gap={2}
         sx={{
            backgroundImage: `url('https://ylfrqmyfhpfcnjvdxxkk.supabase.co/storage/v1/object/public/images/assets/FONDOS/auth-page-background.png')`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
         }}
      >
         <Container
            maxWidth='sm'
            component='form'
            onSubmit={handleSubmit}
            sx={{
               display: 'flex',
               alignItems: 'center',
               flexDirection: 'column',
               gap: 2,
               padding: 5,
               borderRadius: 10,
               mt: 1,
               backgroundColor: 'rgba(210, 210, 210, 0.2)',
               backdropFilter: 'blur(10px)',
            }}
         >
            <Avatar src='/liligrow-icon.png' sx={{ width: 60, height: 60 }} />
            <Typography component='h1' variant='h5'>
               {title}
            </Typography>
            {children}
         </Container>
      </Box>
   )
}

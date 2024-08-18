import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import { LoadingButton } from '@mui/lab'

import AuthWidget from '../widgets/Auth'
import useAuth from '../hooks/useAuth'
import { useSnackbar } from 'notistack'
import { AuthApiError } from '@supabase/supabase-js'

export default function SignIn() {
   const { user, signIn } = useAuth()
   const [loading, setLoading] = useState(false)
   const navigate = useNavigate()
   const { enqueueSnackbar } = useSnackbar()

   const handleSubmit = (event) => {
      event.preventDefault()
      setLoading(true)
      const data = new FormData(event.currentTarget)

      signIn({
         email: data.get('email'),
         password: data.get('password'),
      }).then(({ error }) => {
         setLoading(false)

         if (error instanceof AuthApiError) {
            return enqueueSnackbar('Email o contraseña incorrectos', {
               variant: 'error',
            })
         }
      })
   }

   useEffect(() => {
      if (user) {
         navigate('/')
      }
   }, [user])

   return (
      <>
         {!user && (
            <AuthWidget title='Inicio de sesión' handleSubmit={handleSubmit}>
               <Box width='100%' sx={{ backgroundColor: 'background.paper' }}>
                  <TextField id='email' name='email' label='Email' defaultValue='' fullWidth required />
               </Box>
               <Box width='100%' sx={{ backgroundColor: 'background.paper' }}>
                  <TextField name='password' label='Contraseña' type='password' id='password' required fullWidth />
               </Box>
               <LoadingButton loading={loading} type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
                  Iniciar Sesión
               </LoadingButton>
            </AuthWidget>
         )}
      </>
   )
}

import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import Container from '@mui/material/Container'
import Box from '@mui/material/Box'

import Sidebar from './components/Sidebar'
import AppBar from './components/AppBar'
import useAuth from './hooks/useAuth'

export default function App() {
   const { user } = useAuth()
   const navigate = useNavigate()

   useEffect(() => {
      if (!user) {
         return navigate('/sign-in')
      }
   }, [user])

   return (
      <Box display='grid' height='100vh' gridTemplateColumns={'1fr'} gridTemplateRows='max-content 1fr'>
         <AppBar />
         <Container maxWidth='lg' height='100%' sx={{ p: 4 }}>
            <Box
               display='grid'
               height='100%'
               gap={5}
               sx={{ gridTemplateColumns: { xs: '1fr', md: 'max-content 1fr' } }}
            >
               <Sidebar />
               <Box paddingTop={1}>
                  <Outlet />
               </Box>
            </Box>
         </Container>
      </Box>
   )
}

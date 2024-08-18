import React from 'react'
import ReactDOM from 'react-dom/client'
import './App.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'

import AuthProvider from './context/auth'
import { SnackbarProvider } from 'notistack'

import { createTheme, ThemeProvider, CssBaseline, CircularProgress } from '@mui/material'

const theme = createTheme({
   components: {
      MuiAppBar: {
         styleOverrides: {
            root: {
               height: 85,
               display: 'flex',
               alignItems: 'center',
               borderRadius: 'unset',
               padding: '8px',
            },
         },
      },
      MuiImageList: {
         defaultProps: {
            cols: 'unset',
         },
      },
   },
})

ReactDOM.createRoot(document.getElementById('root')).render(
   <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
         <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
            autoHideDuration={3000}
         >
            <RouterProvider router={router} fallbackElement={<CircularProgress />} />
         </SnackbarProvider>
      </AuthProvider>
   </ThemeProvider>
)

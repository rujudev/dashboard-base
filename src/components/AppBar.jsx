import React, { useState } from 'react'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import AdbIcon from '@mui/icons-material/Adb'
import { Box, Container, SwipeableDrawer } from '@mui/material'
import RoutesList from './RoutesList'
import useAuth from '../hooks/useAuth'

const DRAWER_WIDTH = 200

export default function AppBar() {
   const { user, signOut } = useAuth()
   const [anchorElUser, setAnchorElUser] = useState(null)
   const [drawerState, setDrawerState] = useState(false)

   const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget)
   }

   const handleCloseUserMenu = () => {
      setAnchorElUser(null)
   }

   const toggleDrawer = (event) => {
      setDrawerState(!drawerState)
   }

   return (
      <MuiAppBar position='static'>
         <Container maxWidth='lg' sx={{ height: '100%' }}>
            <Toolbar
               disableGutters
               sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
               }}
            >
               <Box
                  sx={{
                     display: { xs: 'none', md: 'flex' },
                     alignItems: 'center',
                     justifyContent: 'space-between',
                  }}
               >
                  <img
                     src={`${
                        import.meta.env.VITE_SUPABASE_PROJECT_URL
                     }/storage/v1/object/public/images/assets/LOGOS/LOGO%20COMPLETO%20LETRA%20BLANCA.svg`}
                     alt='lili grow shop white logo'
                     style={{ width: 210 }}
                  />
               </Box>

               {/* MOBILE */}
               <Box
                  sx={{
                     flexGrow: 1,
                     height: { xs: '100%' },
                     display: { xs: 'flex', md: 'none' },
                     alignItems: { xs: 'center' },
                  }}
               >
                  <IconButton
                     size='large'
                     aria-label='account of current user'
                     aria-controls='menu-appbar'
                     aria-haspopup='true'
                     onClick={toggleDrawer}
                     color='inherit'
                  >
                     <MenuIcon />
                  </IconButton>
                  <SwipeableDrawer
                     open={drawerState}
                     onOpen={toggleDrawer}
                     onClose={toggleDrawer}
                     disableBackdropTransition={true}
                  >
                     <Box sx={{ width: DRAWER_WIDTH }} role='presentation' onClick={toggleDrawer}>
                        <RoutesList />
                     </Box>
                  </SwipeableDrawer>
               </Box>
               <Box display='flex' gap={2} alignItems='center' sx={{ flexGrow: 0 }}>
                  <Typography variant='body1'>{`Bienvenido ${user?.options?.name}`}</Typography>
                  <Tooltip>
                     <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar
                           alt='Remy Sharp'
                           src={user?.thumbnail ? user.thumbnail : 'https://via.placeholder.com/50'}
                        />
                     </IconButton>
                  </Tooltip>
                  <Menu
                     sx={{ mt: '45px' }}
                     id='menu-appbar'
                     anchorEl={anchorElUser}
                     anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                     }}
                     keepMounted
                     transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                     }}
                     open={Boolean(anchorElUser)}
                     onClose={handleCloseUserMenu}
                  >
                     <MenuItem key={`logout-menu-item`} onClick={signOut}>
                        <Typography textAlign='center'>Cerrar Sesión</Typography>
                     </MenuItem>
                  </Menu>
               </Box>
            </Toolbar>
         </Container>
      </MuiAppBar>
   )
}

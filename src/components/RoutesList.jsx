import { useState, useEffect } from 'react'
import { routes } from '../constants/routes'

// Material UI Components
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

// React router dom components
import { NavLink, useLocation } from 'react-router-dom'

export default function RoutesList() {
   const { pathname } = useLocation()
   const [currentPath, setCurrentPath] = useState('')

   useEffect(() => {
      setCurrentPath(pathname)
   }, [pathname])

   const handleChangePath = (newPath) => {
      setCurrentPath(newPath)
   }

   return (
      <nav>
         <List sx={{ p: 0 }}>
            {routes.map((page) => {
               const { title, path, icon: PageIcon } = page

               return (
                  <ListItem
                     key={`${title}-page`}
                     disablePadding
                     sx={{
                        color: 'inherit',
                        borderLeft: currentPath === path && path.includes(currentPath) ? '3px solid #D23F57' : 'none',
                     }}
                  >
                     <ListItemButton
                        component={NavLink}
                        to={path}
                        onClick={() => (currentPath !== path ? handleChangePath(path) : null)}
                        sx={{ padding: '16px 32px' }}
                        disableRipple
                     >
                        <ListItemIcon sx={{ width: '1em', minWidth: 'unset', marginRight: '1em' }}>
                           <PageIcon sx={{ fill: currentPath === path ? '#D23F57' : '' }} />
                        </ListItemIcon>
                        <ListItemText primary={page.title} />
                     </ListItemButton>
                  </ListItem>
               )
            })}
         </List>
      </nav>
   )
}

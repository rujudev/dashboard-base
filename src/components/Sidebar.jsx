import Drawer from '@mui/material/Drawer'
import RoutesList from './RoutesList'

export default function Sidebar() {
   return (
      <Drawer
         variant='permanent'
         sx={{
            display: { xs: 'none', md: 'flex' },
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
               borderRight: 'none',
               position: 'relative',
               boxSizing: 'border-box',
               borderRadius: '10px',
            },
         }}
         PaperProps={{
            elevation: 2,
            sx: {
               height: 'fit-content',
            },
         }}
      >
         <RoutesList />
      </Drawer>
   )
}

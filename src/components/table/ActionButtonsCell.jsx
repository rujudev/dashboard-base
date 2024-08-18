import { MoreVert } from '@mui/icons-material'
import { IconButton, Menu } from '@mui/material'
import { useState } from 'react'
import ActionButtons from './ActionButtons'

export default function ActionButtonsCell({ hideMenuButton, ...actionButtonsProps }) {
   const [anchorEl, setAnchorEl] = useState(null)
   const openMenu = Boolean(anchorEl)

   const handleOpen = (event) => {
      setAnchorEl(event.currentTarget)
   }

   const handleClose = () => {
      setAnchorEl(null)
   }

   if (hideMenuButton) {
      return <ActionButtons orientation='horizontal' {...actionButtonsProps} />
   }

   return (
      <>
         <IconButton
            aria-label='more'
            id='long-button'
            aria-controls={openMenu ? 'long-menu' : undefined}
            aria-expanded={openMenu ? 'true' : undefined}
            aria-haspopup='true'
            onClick={handleOpen}
         >
            <MoreVert />
         </IconButton>
         <Menu
            id='long-menu'
            MenuListProps={{
               'aria-labelledby': 'long-button',
               disablePadding: true,
            }}
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleClose}
            sx={{ padding: 1 }}
         >
            <ActionButtons orientation='vertical' onCloseMenu={handleClose} {...actionButtonsProps} />
         </Menu>
      </>
   )
}

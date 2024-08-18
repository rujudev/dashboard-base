import { useEffect, useState } from 'react'
import List from '@mui/material/List'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { Avatar, Box, Chip, ListItemButton, Typography } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'

function not(a, b) {
   return a.filter((value) => b.indexOf(value) === -1)
}

function intersection(a, b) {
   return a.filter((value) => b.indexOf(value) !== -1)
}

function union(a, b) {
   return [...a, ...not(b, a)]
}

export default function TransferList({
   id,
   unselectedItems,
   selectedItems,
   title,
   disableHeader = false,
   onUpdate,
   onClose,
}) {
   const [checked, setChecked] = useState([])
   const [unselected, setUnselected] = useState([])
   const [selected, setSelected] = useState([])

   const unselectedChecked = intersection(checked, unselected)
   const selectedChecked = intersection(checked, selected)

   const [isListChanged, setIsListChanged] = useState(false)

   const handleToggle = (value) => () => {
      const currentIndex = checked.indexOf(value)
      const newChecked = [...checked]

      if (currentIndex === -1) {
         newChecked.push(value)
      } else {
         newChecked.splice(currentIndex, 1)
      }

      setChecked(newChecked)
   }

   const numberOfChecked = (items) => intersection(checked, items).length

   const handleToggleAll = (items) => () => {
      if (numberOfChecked(items) === items.length) {
         setChecked(not(checked, items))
      } else {
         setChecked(union(checked, items))
      }
   }

   const handleCheckedRight = () => {
      setSelected(selected.concat(unselectedChecked))
      setUnselected(not(unselected, unselectedChecked))
      setChecked(not(checked, unselectedChecked))
      setIsListChanged((prevIsListChanged) => !prevIsListChanged)
   }

   const handleCheckedLeft = () => {
      setUnselected(unselected.concat(selectedChecked))
      setSelected(not(selected, selectedChecked))
      setChecked(not(checked, selectedChecked))
      setIsListChanged((prevIsListChanged) => !prevIsListChanged)
   }

   const customList = (title, items) => {
      if (Array.isArray(items)) {
         return (
            <Card sx={{ width: '100%' }}>
               <CardHeader
                  sx={{ px: 2, py: 1 }}
                  avatar={
                     <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
                        disabled={items.length === 0}
                        inputProps={{
                           'aria-label': 'all items selected',
                        }}
                     />
                  }
                  title={title}
                  subheader={`${numberOfChecked(items)}/${items.length} selected`}
               />
               <Divider />
               <List
                  sx={{
                     width: 200,
                     height: 230,
                     bgcolor: 'background.paper',
                     overflow: 'auto',
                  }}
                  dense
                  component='div'
                  role='list'
               >
                  {items.map((value) => {
                     // TODO: refactor so that the component has a general contract with which to use in any case
                     const id = typeof value === 'object' ? value?.id : value
                     const text = typeof value === 'object' ? value?.name : value
                     const thumbnail = typeof value === 'object' ? value?.thumbnail : ''

                     return (
                        <ListItemButton key={id} onClick={handleToggle(value)}>
                           <ListItemIcon sx={{ minWidth: 'auto' }}>
                              <Checkbox
                                 checked={checked.indexOf(value) !== -1}
                                 tabIndex={-1}
                                 disableRipple
                                 inputProps={{
                                    'aria-labelledby': `transfer-list-item-checkbox-${text}`,
                                 }}
                              />
                           </ListItemIcon>
                           <ListItemText
                              id={`transfer-list-item-text-${text}`}
                              primary={
                                 thumbnail ? (
                                    <Chip
                                       avatar={
                                          <Avatar
                                             src={thumbnail.url}
                                             alt={thumbnail.name}
                                             sx={{
                                                width: 30,
                                                height: 30,
                                                '& .MuiAvatar-img': { objectFit: 'contain' },
                                             }}
                                          />
                                       }
                                       label={text}
                                       sx={{ backgroundColor: 'transparent' }}
                                    />
                                 ) : (
                                    text
                                 )
                              }
                           />
                        </ListItemButton>
                     )
                  })}
               </List>
            </Card>
         )
      }
   }

   useEffect(() => {
      setUnselected(unselectedItems)
      setSelected(selectedItems)
   }, [unselectedItems, selectedItems])

   useEffect(() => {
      if (disableHeader) {
         onUpdate(id, selected)
      }
   }, [selected])

   return (
      <Box display='flex' flexDirection='column' width='100%' gap={2}>
         {!disableHeader && (
            <Box display='flex' justifyContent='space-between'>
               <Typography variant='h5'>{title}</Typography>
               <Box display='flex' gap={2}>
                  <Button
                     startIcon={<SaveIcon />}
                     variant='contained'
                     color='success'
                     onClick={() => onUpdate(id, selected)}
                     disabled={!isListChanged}
                  >
                     Guardar
                  </Button>
                  <Button startIcon={<CancelIcon />} variant='contained' color='error' onClick={onClose}>
                     Cancelar
                  </Button>
               </Box>
            </Box>
         )}
         <Box
            display='grid'
            gridTemplateColumns='1fr max-content 1fr'
            gridTemplateAreas={`'unselected-list transfer-buttons selected-list'`}
            gap={2}
         >
            <Box gridArea='unselected-list' display='flex' justifyContent='center' alignItems='center'>
               {customList('Sin seleccionar', unselected)}
            </Box>
            <Box
               gridArea='transfer-buttons'
               display='flex'
               flexDirection='column'
               alignItems='center'
               justifyContent='center'
            >
               <Button
                  sx={{ my: 0.5 }}
                  variant='outlined'
                  size='small'
                  onClick={handleCheckedRight}
                  disabled={unselectedChecked.length === 0}
                  aria-label='mover seleccionadas a la derecha'
               >
                  &gt;
               </Button>
               <Button
                  sx={{ my: 0.5 }}
                  variant='outlined'
                  size='small'
                  onClick={handleCheckedLeft}
                  disabled={selectedChecked.length === 0}
                  aria-label='mover seleccionadas a la izquierda'
               >
                  &lt;
               </Button>
            </Box>
            <Box gridArea='selected-list' display='flex' justifyContent='center' alignItems='center'>
               {customList('Seleccionadas', selected)}
            </Box>
         </Box>
      </Box>
   )
}

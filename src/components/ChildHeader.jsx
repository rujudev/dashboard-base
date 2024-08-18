import { ArrowBack, Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Typography } from '@mui/material'
import OptionsToolbar from './OptionsToolbar'

export default function ChildHeader({
   onNavigateTo = () => {},
   loading = false,
   options = [],
   disableButton = false,
   ...props
}) {
   return (
      <Box
         display='grid'
         gridTemplateColumns='max-content 1fr max-content'
         gridTemplateAreas={`
            'back-page-button . save-button'
            ${options.length > 0 ? "'options options options'" : ''}
         `}
         rowGap={4}
         {...props}
      >
         <Box gridArea='back-page-button'>
            <Button variant='contained' color='secondary' onClick={onNavigateTo}>
               <ArrowBack sx={{ marginRight: '0.4rem' }} />
               <Typography component='h4' variant='inherit' lineHeight='normal'>
                  Volver atrás
               </Typography>
            </Button>
         </Box>
         <Box gridArea='save-button' display='flex' gap={2}>
            <LoadingButton
               loading={loading}
               variant='contained'
               type='submit'
               loadingPosition='start'
               startIcon={<Save />}
               sx={{ display: 'flex' }}
               disabled={disableButton}
            >
               Guardar
            </LoadingButton>
         </Box>
         {options.length > 0 && <OptionsToolbar gridArea='options' display='flex' width='100%' options={options} />}
      </Box>
   )
}

import { useState } from 'react'
import { Box, TextField, Typography } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { Form, useLoaderData, useLocation, useNavigate } from 'react-router-dom'
import { preventDefaultEnterKey } from '../../utils/form'
import ChildHeader from '../ChildHeader'
import Switch from '../Switch'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { supabase } from '../../config/supabase-client'

export default function VoucherCode() {
   const { voucherCode } = useLoaderData()
   const navigate = useNavigate()
   const { pathname } = useLocation()
   const [loading, setLoading] = useState(false)
   const [navigateBackTo, setNavigateBackTo] = useState(-1)

   const [code] = useState(voucherCode?.code || '')
   const [isActive, setIsActive] = useState(voucherCode?.isActive || true)
   const [isGeneral] = useState(voucherCode?.isGeneral || true)
   const [percentage] = useState(voucherCode?.percentage || 0)
   const [hasExpirationDate, setHasExpirationDate] = useState(voucherCode?.hasExpirationDate || false)
   const [expirationDate, setExpirationDate] = useState(voucherCode?.expirationDate || null)
   const [totalUses] = useState(voucherCode?.totalUses || 0)
   const [limitOfUses] = useState(voucherCode?.limitOfUses || 0)

   const customOptions = [
      <Switch
         key='is-active-option'
         name='is-active'
         checked={isActive}
         onChange={() => setIsActive((prevIsActive) => !prevIsActive)}
         label='Activo'
      />,
      <Switch key='is-general-option' name='is-general' checked={isGeneral} label='Código general' disabled readOnly />,
      <Switch
         key='has-expiration-date-option'
         name='has-expiration-date'
         checked={hasExpirationDate}
         onClick={() => setHasExpirationDate((prevHasExpirationDate) => !prevHasExpirationDate)}
         label='Con fecha límite'
      />,
   ]

   const handleOnSubmit = async (e) => {
      e.preventDefault()
      setLoading(true)

      const formData = new FormData(e.target)
      const code = formData.get('code')
      const percentage = formData.get('percentage')
      const limitOfUses = formData.get('limit-of-uses')

      const data = {
         code,
         percentage,
         limit_of_uses: limitOfUses,
         is_active: isActive,
         is_general: isGeneral,
         expiration_date: dayjs(expirationDate),
         has_expiration_date: hasExpirationDate,
      }

      if (pathname.includes('create')) {
         const { data: insertVoucherCodeData, error: insertVoucherCodeError } = await supabase
            .from('voucher-codes')
            .insert([{ ...data }])
            .select()
            .single()

         if (!insertVoucherCodeError) {
            const { id } = insertVoucherCodeData

            setLoading(false)
            setNavigateBackTo(-2)
            return navigate(`/voucher-codes/${id}/edit`)
         }
      }

      if (pathname.includes('edit')) {
         await supabase
            .from('voucher-codes')
            .update([{ ...data }])
            .eq('id', voucherCode.id)

         setLoading(false)
         setNavigateBackTo(-2)
         return navigate(`/voucher-codes/${voucherCode.id}/edit`)
      }
   }

   const handleChangeExpirationDate = (newDate) => {
      setExpirationDate(newDate)
   }

   return (
      <Box
         component={Form}
         method='post'
         onSubmit={handleOnSubmit}
         onKeyDown={preventDefaultEnterKey}
         display='grid'
         gridTemplateColumns='max-content 1fr max-content'
         gridTemplateRows='max-content max-content 1fr'
         rowGap={4}
         gridTemplateAreas={`
            'header header header'
            'voucher-code-name . .'
            'voucher-code-layout voucher-code-layout voucher-code-layout' 
         `}
         width='100%'
      >
         <ChildHeader
            gridArea='header'
            onNavigateTo={() => navigate(navigateBackTo)}
            loading={loading}
            options={customOptions}
         />
         <Box gridArea='voucher-code-name' display='flex' gap={1}>
            <Typography variant='h2' fontSize='25px' fontWeight='bold'>
               Código:
            </Typography>
            <Typography component='span' variant='h2' fontSize='25px' fontStyle='italic'>
               {voucherCode.code}
            </Typography>
         </Box>
         <Box
            display='grid'
            gridTemplateColumns='repeat(3, minmax(250px, auto-fit))'
            gridTemplateRows='max-content max-content'
            gridTemplateAreas={`
                  'code percentage expiration-date'
                  'total-uses . limit-of-uses'
               `}
            gridArea='voucher-code-layout'
            alignItems='center'
            columnGap={{ xs: 3 }}
            rowGap={{ xs: 3 }}
         >
            <Box gridArea='code'>
               <TextField id='code' name='code' label='Código' defaultValue={code} fullWidth />
            </Box>
            <Box gridArea='percentage'>
               <TextField
                  id='percentage'
                  name='percentage'
                  label='Porcentaje'
                  type='number'
                  inputProps={{ min: 0, max: 100 }}
                  defaultValue={percentage}
                  fullWidth
               />
            </Box>
            <Box gridArea='expiration-date'>
               <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                     label='Fecha límite'
                     name='expiration-date'
                     format='DD/MM/YYYY'
                     value={dayjs(expirationDate)}
                     onChange={handleChangeExpirationDate}
                     disabled={!hasExpirationDate}
                     sx={{ width: '100%' }}
                  />
               </LocalizationProvider>
            </Box>
            <Box gridArea='total-uses'>
               <TextField
                  id='total-uses'
                  name='total-uses'
                  label='Usos totales'
                  defaultValue={totalUses}
                  fullWidth
                  readOnly
                  disabled
               />
            </Box>
            <Box gridArea='limit-of-uses'>
               <TextField
                  id='limit-of-uses'
                  name='limit-of-uses'
                  label='Límite de usos'
                  defaultValue={limitOfUses}
                  fullWidth
               />
            </Box>
         </Box>
      </Box>
   )
}

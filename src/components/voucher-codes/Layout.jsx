import { Box, CircularProgress } from '@mui/material'
import { useLoaderData } from 'react-router-dom'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import { useState, useEffect } from 'react'
import VoucherCodes from './VoucherCodes'
import Metrics from '../Metrics'
import ParentHeader from '../ParentHeader'

export default function Layout() {
   const data = useLoaderData()
   const [voucherCodes, setVoucherCodes] = useState([])
   const [loading, setLoading] = useState(true)

   const voucherCodesMetrics = [
      {
         title: 'Total códigos generales',
         value: voucherCodes.filter((voucherCode) => voucherCode.isGeneral).length,
      },
      {
         title: 'Total códigos asignados a categorías',
         value: voucherCodes.filter((voucherCode) => !voucherCode.isGeneral).length,
      },
   ]

   const handleUpdateVoucherCodesList = (updatedVoucherCodesList) => {
      setVoucherCodes(updatedVoucherCodesList)
   }

   useEffect(() => {
      if (data?.voucherCodes) {
         const { voucherCodes: loadedVoucherCodes } = data
         setVoucherCodes(loadedVoucherCodes)
      }

      setLoading(false)
   }, [data?.voucherCodes])

   return (
      <Box
         display='grid'
         gridTemplateColumns='max-content 1fr max-content'
         gridTemplateRows='max-content max-content 1fr'
         rowGap={3}
         gridTemplateAreas={`
               "page-name . add-voucher-code"
               "metrics metrics metrics"
               "voucher-codes-list voucher-codes-list voucher-codes-list"
            `}
         width='100%'
         height='100%'
      >
         <ParentHeader
            buttonGridArea='add-voucher-code'
            PageIcon={QrCode2Icon}
            title='Códigos de descuento'
            buttonText='Añadir nuevo código de descuento'
            buttonToPath='/voucher-codes/create'
         />
         {!loading ? (
            <>
               <Metrics gridArea='metrics' dataSet={voucherCodesMetrics} />
               <Box gridArea='voucher-codes-list'>
                  <VoucherCodes voucherCodes={voucherCodes} onUpdateVoucherCodeList={handleUpdateVoucherCodesList} />
               </Box>
            </>
         ) : (
            <CircularProgress />
         )}
      </Box>
   )
}

import { useState } from 'react'
import dayjs from 'dayjs'
import DataTable from '../table/DataTable'
import ActionButtonsCell from '../table/ActionButtonsCell'
import { supabase } from '../../config/supabase-client'

export default function VoucherCodes({ voucherCodes, onUpdateVoucherCodeList }) {
   const handleRemoveVoucherCode = async (voucherCodeId) => {
      console.log(voucherCodeId)
      await supabase
         .from('categories')
         .update([{ voucher_code: null, is_active_category_voucher_code: false }])
         .eq('voucher_code', voucherCodeId)

      const { error: removeVoucherCodeError } = await supabase.from('voucher-codes').delete().eq('id', voucherCodeId)

      if (!removeVoucherCodeError) {
         const newCategoriesList = voucherCodes.filter((voucherCode) => voucherCode.id !== voucherCodeId)
         onUpdateVoucherCodeList(newCategoriesList)
      }
   }

   const [columns] = useState([
      {
         field: 'code',
         headerName: 'Código',
      },
      {
         field: 'percentage',
         headerName: 'Porcentaje',
         renderCell: (params) => `${params.value}%`,
      },
      { field: 'totalUses', headerName: 'Total usos' },
      { field: 'limitOfUses', headerName: 'Limite de usos', flex: 1 },
      {
         field: 'expirationDate',
         headerName: 'Fecha de caducidad',
         flex: 1,
         renderCell: (params) => {
            const { value } = params
            const { isLimited, date } = value

            return isLimited && date && dayjs(date).format('DD/MM/YYYY')
         },
      },
      {
         field: 'voucherCodeCategory',
         headerName: 'Asig. a la categoría',
         flex: 1,
      },
      {
         field: 'action',
         headerName: '',
         pinnable: true,
         align: 'center',
         sortable: false,
         type: 'actions',
         renderCell: ({ id }) => (
            <ActionButtonsCell
               itemId={id}
               page='voucher-codes'
               handleRemoveItem={handleRemoveVoucherCode}
               edit
               remove
            />
         ),
      },
   ])

   return <DataTable columns={columns} rows={voucherCodes} noRowsDescription='No hay códigos de descuento creados' />
}

import { memo, useCallback, useState, useEffect } from 'react'
import usePrice from '../../hooks/usePrice'
import ActionButtonsCell from '../table/ActionButtonsCell'
import DataTable, { CellVariant, renderEditInputCell, renderIsActiveCell, renderResultCell } from '../table/DataTable'
import { GridCellEditStopReasons } from '@mui/x-data-grid'
import { formatDiscount } from '../../utils'

export default function Packs({ price, packs, onUpdatePack, onRemovePack, onToggleIsActivePack }) {
   const { getPriceByQuantity, getPriceWithDiscount } = usePrice('')
   const [pack, setPack] = useState(null)

   const toggleIsActiveById = useCallback(({ id, value }) => {
      onUpdatePack(id, { isActive: value })
   }, [])

   const handleChangeQuantity = useCallback(({ value }) => {
      const quantity = Number(value)
      setPack((prevPack) => ({
         ...prevPack,
         quantity,
         ...(quantity === 0 && { discount: 0, total_price_with_discount: 0 }),
      }))
   }, [])

   const handleChangeDiscount = useCallback(({ value }) => {
      const discount = formatDiscount(value)
      setPack((prevPack) => ({ ...prevPack, discount }))
   }, [])

   const columns = [
      {
         field: 'isActive',
         headerName: 'Activo',
         maxWidth: 100,
         renderCell: (params) => {
            const { isActive: rowIsActive, quantity: rowQuantity } = params.row
            const parsedQuantity = Number(rowQuantity)
            const isActive = rowIsActive && parsedQuantity > 0
            const disabled = parsedQuantity === 0

            return renderIsActiveCell({
               onToggleCheckedById: toggleIsActiveById,
               isActive,
               disabled,
               ...params,
            })
         },
      },
      {
         field: 'quantity',
         editable: true,
         headerName: 'Cantidad',
         flex: 1,
         renderEditCell: (params) => {
            return renderEditInputCell({
               onHandleChange: handleChangeQuantity,
               variant: CellVariant.QUANTITY,
               ...params,
            })
         },
         sortComparator: (v1, v2) => v1 - v2,
      },
      {
         field: 'total_price',
         headerName: 'Precio pack',
         flex: 1,
         renderCell: ({ row }) => {
            const { quantity: rowQuantity } = row
            const totalPrice = getPriceByQuantity(price, rowQuantity)

            return renderResultCell({ value: totalPrice })
         },
      },
      {
         field: 'discount',
         editable: true,
         headerName: 'Descuento (%)',
         flex: 1,
         renderEditCell: (params) => {
            return renderEditInputCell({
               onHandleChange: handleChangeDiscount,
               variant: CellVariant.DISCOUNT,
               ...params,
            })
         },
         sortComparator: (v1, v2) => {
            const discount1 = formatDiscount(v1)
            const discount2 = formatDiscount(v2)

            return discount1 - discount2
         },
      },
      {
         field: 'total_price_with_discount',
         headerName: 'Precio con Dto.',
         flex: 1,
         renderCell: ({ row }) => {
            const { discount: rowDiscount, quantity: rowQuantity } = row
            const priceWithDiscount = getPriceWithDiscount(price, rowDiscount, rowQuantity)

            return renderResultCell({ value: priceWithDiscount })
         },
      },
      {
         field: 'action',
         headerName: '',
         pinnable: true,
         align: 'center',
         sortable: false,
         type: 'actions',
         width: 80,
         renderCell: ({ id }) => (
            <ActionButtonsCell itemId={id} onRemoveItem={onRemovePack} remove removeButtonText={false} hideMenuButton />
         ),
      },
   ]

   return (
      <DataTable
         columns={columns}
         rows={packs}
         noRowsDescription='No se han creado packs'
         onCellEditStart={({ row }) => setPack(row)}
         onCellEditStop={(params, event) => {
            const { reason } = params

            if (reason === GridCellEditStopReasons.enterKeyDown) {
               const { row, field } = params

               let updatedPack = {
                  [field]: pack[field],
               }

               if (field === CellVariant.QUANTITY) {
                  if (pack.quantity > 0) {
                     updatedPack = {
                        ...updatedPack,
                        total_price: getPriceByQuantity(price, pack.quantity),
                     }

                     if (pack.discount > 0) {
                        updatedPack = {
                           ...updatedPack,
                           total_price_with_discount: getPriceWithDiscount(price, pack.discount, pack.quantity),
                        }
                     }
                  } else {
                     updatedPack = {
                        ...updatedPack,
                        isActive: false,
                        discount: 0,
                        total_price: 0,
                        total_price_with_discount: 0,
                     }
                  }
               }

               if (field === CellVariant.DISCOUNT && pack.discount > 0) {
                  updatedPack = {
                     ...updatedPack,
                     total_price_with_discount: getPriceWithDiscount(price, pack.discount, pack.quantity),
                  }
               }

               setPack(null)
               onUpdatePack(row.id, updatedPack)
            }

            if (reason === GridCellEditStopReasons.cellFocusOut) {
               event.preventDefault()
            }
         }}
         hideToolbar
         hideFooter
      />
   )
}

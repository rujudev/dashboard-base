import InputUnstyled from '@mui/material/InputBase'
import { Box, Checkbox, Typography } from '@mui/material'
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter, useGridApiContext } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import CustomNoRowsOverlay from '../NoRowsOverlay'
import CustomPagination from './Pagination'

export const CellVariant = {
   PRICE: 'price',
   QUANTITY: 'quantity',
   DISCOUNT: 'discount',
}

function CustomNumericFormat(props) {
   return (
      <NumericFormat
         {...props}
         style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', padding: '0 10px' }}
         autoFocus
      />
   )
}

function EditInputCell(props) {
   const { id, field, value, variant, onHandleChange } = props
   const apiRef = useGridApiContext()

   const handleChange = (event) => {
      const { value: inputValue } = event.target

      onHandleChange({ id, value: inputValue })
      apiRef.current.setEditCellValue({ id, field, value: inputValue })
   }

   if (variant === CellVariant.PRICE || variant === CellVariant.DISCOUNT) {
      return (
         <CustomNumericFormat
            decimalScale={2}
            thousandSeparator='.'
            decimalSeparator=','
            allowNegative={false}
            value={value}
            onChange={handleChange}
         />
      )
   }

   return (
      <InputUnstyled
         slotProps={{
            root: {
               style: {
                  width: '100%',
               },
            },
            input: {
               autoFocus: true,
               value,
               onChange: handleChange,
               style: {
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  padding: '0 10px',
               },
            },
         }}
      />
   )
}

function IsActiveCell(props) {
   const { id, field, isActive, disabled, onToggleCheckedById } = props
   const apiRef = useGridApiContext()
   const [isChecked, setIsChecked] = useState(isActive)

   const toggleChecked = (event) => {
      const { checked: newCheckedValue } = event.target

      setIsChecked(newCheckedValue)
      onToggleCheckedById({ id, value: newCheckedValue })
      apiRef.current.setEditCellValue({ id, field, value: newCheckedValue })
   }

   useEffect(() => {
      setIsChecked(isActive)
   }, [isActive])

   return <Checkbox checked={isChecked && !disabled} onChange={toggleChecked} color='primary' disabled={disabled} />
}

function ResultCell(props) {
   const { value } = props

   return <Typography variant='body2'>{value !== '0' ? `${value} €` : '-'}</Typography>
}

export function renderEditInputCell(params) {
   return <EditInputCell {...params} />
}

export function renderIsActiveCell(params) {
   return <IsActiveCell {...params} />
}

export function renderResultCell(params) {
   const { value } = params

   return (
      <Box width='100%'>
         <CustomNumericFormat
            customInput={ResultCell}
            decimalScale={2}
            thousandSeparator='.'
            decimalSeparator=','
            value={value}
         />
      </Box>
   )
}

export default function DataTable({ columns, rows, noRowsDescription, hideToolbar = false, ...props }) {
   const [paginationModel, setPaginationModel] = useState({
      pageSize: 5,
      page: 0,
   })

   return (
      <DataGrid
         columns={columns}
         rows={rows}
         getRowHeight={({ densityFactor }) => {
            return 90 * densityFactor
         }}
         rowCount={rows.length}
         slots={{
            pagination: CustomPagination,
            ...(!hideToolbar && {
               toolbar: () => (
                  // TODO: Make custom filters
                  <GridToolbarContainer sx={{ display: 'flex', justifyContent: 'end', padding: 1 }}>
                     <GridToolbarQuickFilter debounceMs={50} />
                  </GridToolbarContainer>
               ),
            }),
            noRowsOverlay: () => <CustomNoRowsOverlay description={noRowsDescription} />,
            noResultsOverlay: () => <CustomNoRowsOverlay description='No se han encontrado coincidencias' />,
         }}
         slotProps={{
            baseTextField: {
               variant: 'outlined',
               size: 'small',
               placeholder: 'Buscar producto',
               sx: { width: '100%' },
            },
         }}
         sx={{
            border: 'unset',
            '& .MuiDataGrid-columnHeaderTitle': {
               fontWeight: 'bold',
            },
            '& .MuiDataGrid-columnHeader:focus-within': {
               outline: 'none',
            },
            '& .MuiDataGrid-columnHeader:last-child .MuiDataGrid-columnSeparator': {
               // Eliminamos el último separador de columnas (definir directamente en la creación del tema)
               display: 'none',
            },
            '& .MuiDataGrid-columnHeader:focus, .MuiDataGrid-columnHeader:focus-within, .MuiDataGrid-cell:focus, .MuiDataGrid-cell:focus-within':
               {
                  outline: 'none',
               },
            '& .MuiDataGrid-cellContent': {
               whiteSpace: 'wrap',
            },
            '& .MuiDataGrid-virtualScroller': rows.length === 0 && {
               paddingY: 4,
            },
         }}
         paginationModel={paginationModel}
         onPaginationModelChange={setPaginationModel}
         pageSizeOptions={[5, 10, 25]}
         disableColumnMenu
         disableColumnSelector
         disableSelectionOnClick
         disableRowSelectionOnClick
         autoHeight
         {...props}
      />
   )
}

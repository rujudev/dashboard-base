import React from 'react'
import MuiPagination from '@mui/material/Pagination'
import { gridPageCountSelector, GridPagination, useGridApiContext, useGridSelector } from '@mui/x-data-grid'

function Pagination({ page, onPageChange, className }) {
   const gridApiRef = useGridApiContext()
   const pageCount = useGridSelector(gridApiRef, gridPageCountSelector)

   return (
      <MuiPagination
         count={pageCount}
         page={page + 1}
         color='primary'
         className={className}
         onChange={(event, newPage) => {
            onPageChange(event, newPage - 1)
         }}
      />
   )
}

export default function CustomPagination(props) {
   return (
      <GridPagination
         ActionsComponent={Pagination}
         {...props}
         labelRowsPerPage='Filas por página'
         labelDisplayedRows={({ from, to, count }) => `${from} - ${to} de ${count}`}
      />
   )
}

import { Box, Chip, FormControl, InputLabel, Select as MuiSelect } from '@mui/material'
import React from 'react'

const Select = ({ selectRef, label, name, defaultValue = '', items, ...props }) => {
   return (
      <FormControl sx={{ minWidth: `${label.length}px` }} fullWidth>
         <InputLabel id={`select-${name}-label`}>{label}</InputLabel>
         <MuiSelect
            inputRef={selectRef}
            label={label}
            labelId={`select-${name}-label`}
            id={`select-${name}-label`}
            name={name}
            value={defaultValue}
            renderValue={(selected) => (
               <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                     <Chip key={value} label={value} />
                  ))}
               </Box>
            )}
            {...props}
         >
            añlsdkfj
         </MuiSelect>
      </FormControl>
   )
}

export default Select

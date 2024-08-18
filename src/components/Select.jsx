import { FormControl, InputLabel, MenuItem, Select as MuiSelect } from '@mui/material'
import React from 'react'

const Select = ({ selectRef, label, name, items, defaultValueText, ...props }) => {
   return (
      <FormControl fullWidth>
         <InputLabel id={`select-${name}-label`}>{label}</InputLabel>
         <MuiSelect
            inputRef={selectRef}
            label={label}
            labelId={`select-${name}-label`}
            id={`select-${name}-label`}
            name={name}
            {...props}
            value={items.length > 0 && props?.value ? props.value : ''}
         >
            <MenuItem value='' disabled>
               {defaultValueText}
            </MenuItem>

            {items.length > 0 &&
               items.map((item, index) => {
                  if (typeof item === 'object') {
                     return (
                        <MenuItem key={`item-${index}-${item.id}`} value={item.id}>
                           {item.name}
                        </MenuItem>
                     )
                  }

                  return (
                     <MenuItem key={`item-${index}-${item}`} value={item}>
                        {item}
                     </MenuItem>
                  )
               })}
         </MuiSelect>
      </FormControl>
   )
}
export default Select

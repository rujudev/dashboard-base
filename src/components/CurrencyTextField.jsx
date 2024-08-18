import { TextField } from '@mui/material'
import React from 'react'
import { NumericFormat } from 'react-number-format'
import { ADORNMENT } from '../constants/adornments'
import InputAdornment from './InputAdornment'

function CustomInput(props) {
   const { currency } = props

   return (
      <TextField
         InputProps={{
            startAdornment: currency && <InputAdornment currency={`${currency}`} position='start' />,
         }}
         {...props}
      />
   )
}

export default function CurrencyTextField(props) {
   const { isDiscountInputType, hideCurrency, value, ...restOfProps } = props
   const [isFocused, setIsFocused] = React.useState(false)

   const handleToggleShowCurrencyIfTextFieldIsFocused = () => {
      setIsFocused(!isFocused)
   }

   return (
      <NumericFormat
         customInput={CustomInput}
         decimalScale={2}
         thousandSeparator='.'
         decimalSeparator=','
         allowNegative={false}
         onFocus={handleToggleShowCurrencyIfTextFieldIsFocused}
         onBlur={handleToggleShowCurrencyIfTextFieldIsFocused}
         value={value}
         {...restOfProps}
         {...(!hideCurrency &&
            (isFocused || value ? { currency: isDiscountInputType ? ADORNMENT.DISCOUNT : ADORNMENT.CURRENCY } : ''))}
      />
   )
}

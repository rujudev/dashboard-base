import { FormControlLabel, FormGroup, Switch as MuiSwitch } from '@mui/material'
import { memo, useMemo } from 'react'

export default function Switch({ switchRef, label, ...props }) {
   return <FormControlLabel control={<MuiSwitch color='primary' {...props} />} label={label} />
}

import { Box, Card, CardContent, Typography } from '@mui/material'

export default function Metrics({ dataSet, ...props }) {
   return (
      <Box display='flex' justifyContent='space-around' {...props}>
         {dataSet.map(({ title, value, color, element }) => {
            return (
               <Card key={`metric-${title}-with-value-${value}`} elevation={0}>
                  <CardContent
                     sx={{
                        textAlign: 'center',
                        '&:last-child': {
                           padding: 1,
                        },
                     }}
                  >
                     <Typography variant='body1' color={color}>
                        {title}
                     </Typography>
                     <Box display='flex' alignItems='center' justifyContent='center' gap={1}>
                        <Typography variant='h4' color={color}>
                           {value}
                        </Typography>
                        {element && element}
                     </Box>
                  </CardContent>
               </Card>
            )
         })}
      </Box>
   )
}

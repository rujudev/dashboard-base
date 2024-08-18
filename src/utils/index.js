export function formatString(string) {
   const value = typeof string === 'string' ? string : String(string)

   return value.replaceAll('.', '').replace(',', '.')
}

export function formatDiscount(discount) {
   const parsedDiscount = String(discount).startsWith('0,') ? formatString(discount) * 100 : Number(discount)

   return parsedDiscount
}

export function getObjectKeys(object) {
   return Object.keys(object)
}

import { useEffect, useState } from 'react'
import { formatString } from '../utils'

// TODO: Refactor this custom hook to manage the price
export default function usePrice({ initialPrice = '' }) {
   const [price, setPrice] = useState(initialPrice)

   useEffect(() => {
      setPrice(initialPrice)
   }, [initialPrice])

   const getPriceByQuantity = (priceValue, quantity) => {
      const parsedPrice = Number(formatString(priceValue))
      const parsedQuantity = Number(quantity)

      if (parsedPrice === 0 || parsedQuantity === 0) return 0

      return parsedPrice * parsedQuantity
   }

   const getPriceWithDiscount = (priceValue, discount, quantity) => {
      const priceString = String(priceValue)
      const beginningOfPrice = priceString.substring(0, priceString.length - 3)
      const endOfPrice = priceString.substring(priceString.length - 3, priceString.length)
      const parsedEndOfPrice = !endOfPrice.includes('.') ? formatString(endOfPrice) : endOfPrice

      const parsedPrice = beginningOfPrice.concat(parsedEndOfPrice)
      const parsedQuantity = Number(quantity) || 0
      const parsedDiscount = String(discount).startsWith('0,') ? formatString(discount) : Number(discount) / 100

      if (parsedPrice > 0 && parsedQuantity > 0 && parsedDiscount > 0) {
         const totalPriceByQuantity = parsedPrice * parsedQuantity
         return totalPriceByQuantity - totalPriceByQuantity * parsedDiscount
      }

      if (parsedPrice > 0 && parsedDiscount > 0) {
         return parsedPrice - parsedPrice * parsedDiscount
      }
   }

   return {
      price,
      getPriceByQuantity,
      getPriceWithDiscount,
   }
}

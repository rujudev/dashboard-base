import { supabase } from '../../config/supabase-client'

export default async function loader({ request, params }) {
   const { url } = request

   if (url.includes('edit')) {
      const { id } = params
      const { data: voucherCodeData, error: voucherCodeError } = await supabase
         .from('voucher-codes')
         .select()
         .eq('id', id)
         .single()

      const {
         has_expiration_date: hasExpirationDate,
         expiration_date: expirationDate,
         is_active: isActive,
         is_general: isGeneral,
         limit_of_uses: limitOfUses,
         total_uses: totalUses,
         ...props
      } = voucherCodeData

      return {
         voucherCode: {
            ...props,
            hasExpirationDate,
            expirationDate,
            isActive,
            isGeneral,
            limitOfUses,
            totalUses,
         },
      }
   }

   return {
      voucherCode: {
         code: '',
         percentage: 0,
         totalUses: 0,
         limitOfUses: 0,
         hasExpirationDate: false,
         expirationDate: null,
         isGeneral: false,
         isActive: false,
      },
   }
}

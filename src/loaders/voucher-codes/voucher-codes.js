import { supabase } from '../../config/supabase-client'

export default async function loader() {
   const { data: voucherCodesData, error: voucherCodesError } = await supabase.from('voucher-codes').select()
   const { data: categoriesData, error: categoriesError } = await supabase.from('categories').select()

   const mapVoucherCodesData = voucherCodesData.map((voucherCode) => {
      const voucherCodeCategory =
         categoriesData.find((category) => category.voucher_code !== null && category.voucher_code === voucherCode.id)
            ?.name || null

      const {
         total_uses: totalUses,
         limit_of_uses: limitOfUses,
         has_expiration_date: hasExpirationDate,
         expiration_date: expirationDate,
         is_general: isGeneral,
         is_active: isActive,
         created_at: createdAt,
         ...restOfProps
      } = voucherCode

      return {
         totalUses,
         limitOfUses,
         expirationDate: {
            isLimited: hasExpirationDate,
            date: expirationDate || null,
         },
         isGeneral,
         isActive,
         voucherCodeCategory,
         createdAt,
         ...restOfProps,
      }
   })

   return {
      voucherCodes: mapVoucherCodesData,
      error: voucherCodesError,
   }
}

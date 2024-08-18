/* eslint-disable camelcase */
import { supabase } from '../../config/supabase-client'

export default async function loader({ request, params }) {
   const { url } = request
   if (url.includes('edit')) {
      const { id } = params

      const { data } = await supabase.from('categories').select().eq('id', id).single()

      const {
         sub_categories: subCategories,
         voucher_code: voucherCode,
         is_active: isActive,
         is_active_category_voucher_code: isActiveCategoryVoucherCode,
         ...restOfProps
      } = data

      return {
         category: {
            ...restOfProps,
            id,
            voucherCode,
            isActive,
            isActiveCategoryVoucherCode,
            subCategories: subCategories || [],
         },
      }
   }

   return {
      category: {
         id: '',
         name: '',
         voucherCode: '',
         thumbnail: null,
         isActive: false,
         isActiveCategoryVoucherCode: false,
         subCategories: [],
      },
   }
}

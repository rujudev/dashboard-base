import { supabase } from '../config/supabase-client'

export async function mapCategoriesArray(categories = []) {
   const { data: voucherCodesData } = await supabase.from('voucher-codes').select('id, code')

   return categories.map((category) => {
      const {
         voucher_code: voucherCode,
         sub_categories: subCategories,
         is_active_category_voucher_code: isActiveCategoryVoucherCode,
         is_active: isActive,
         ...restOfProps
      } = category

      const mapVoucherCode = voucherCodesData
         ? voucherCodesData.find((voucherCode) => voucherCode.id === category.voucher_code)
         : null

      return {
         subCategories,
         isActive,
         voucherCode: {
            isActiveInCategory: isActiveCategoryVoucherCode,
            code: mapVoucherCode?.code ?? null,
         },
         ...restOfProps,
      }
   })
}

export function getNonDeletedSubCategories(subCategories) {
   if (!subCategories || !Array.isArray(subCategories)) return []

   return subCategories.filter((subCategory) => !subCategory?.deleted)
}

export function getNonDeletedSubCategoryTags(tags) {
   if (!tags || !Array.isArray(tags)) return []

   return tags.filter((tag) => !tag?.deleted)
}

export function removeTag(tags, tagId) {
   return tags.map((tag) => (tag.id === tagId ? { ...tag, deleted: true } : tag))
}

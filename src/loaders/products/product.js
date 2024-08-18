/* eslint-disable camelcase */
import { supabase } from '../../config/supabase-client'

export default async function loader({ request, params }) {
   const { url } = request
   const { data: categories } = await supabase.from('categories').select('id, name, sub_categories')

   if (url.includes('edit')) {
      const { id: productId } = params
      const { data: productData, error: productError } = await supabase
         .from('products')
         .select()
         .single()
         .eq('id', productId)

      const {
         img_gallery: imgGallery,
         review_ids: reviewIds,
         with_discount: withDiscount,
         with_formats: withFormats,
         with_packs: withPacks,
         is_hidden: isHidden,
         category_id: categoryId,
         created_at: createdAt,
         sub_categories: subCategories,
         ...restOfProps
      } = productData

      const category = categories.find((category) => category.id === categoryId)
      const { sub_categories: categorySubCategories, ...restOfCategory } = category
      const productSubCategoriesAux = [...subCategories]

      for (let i = 0; i < productSubCategoriesAux.length; i++) {
         const productSubCategory = productSubCategoriesAux[i]
         const categorySubCategoryFound = categorySubCategories.find(
            (categorySubCategory) => categorySubCategory.id === productSubCategory.id
         )

         if (!categorySubCategoryFound) {
            subCategories.splice(i, 1)
            continue
         }

         const categorySubCategoryTags = categorySubCategoryFound.tags
         const productSubCategoryTags = productSubCategory.tags || []

         for (let i = 0; i < productSubCategoryTags.length; i++) {
            const subCategoryTag = productSubCategory.tags[i]
            const categorySubCategoryTagFound = categorySubCategoryTags.find((tag) => tag.id === subCategoryTag.id)

            if (!categorySubCategoryTagFound) {
               productSubCategory.tags.splice(i, 1)
            } else {
               productSubCategory.tags.splice(i, 1, categorySubCategoryTagFound)
            }
         }
      }

      return {
         product: {
            ...restOfProps,
            category: {
               ...restOfCategory,
               subCategories: categorySubCategories || [],
            },
            subCategories: subCategories || [],
            withDiscount: withDiscount || false,
            withFormats: withFormats || false,
            withPacks: withPacks || false,
            imgGallery: imgGallery || [],
         },
         categories,
         productError,
      }
   }

   return {
      product: {
         name: '',
         description: '',
         price: 0,
         discount: 0,
         category: null,
         subCategories: [],
         imgGallery: [],
         thumbnail: '',
         reviews: [],
         withDiscount: false,
         withFormats: false,
         withPacks: false,
         packs: [],
         formats: [],
      },
      categories,
   }
}

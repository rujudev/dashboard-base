import { supabase } from '../../config/supabase-client'
import { mapCategoriesArray } from '../../utils/categories'

export default async function loader() {
   const { data: categories } = await supabase.from('categories').select()
   const categoriesData = await mapCategoriesArray(categories)

   return { categories: categoriesData || [] }
}

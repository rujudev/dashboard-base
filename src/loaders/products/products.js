import { supabase } from '../../config/supabase-client'

export default async function loader() {
   const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('id, is_hidden, name, price, category_id, stock, thumbnail, with_packs, with_formats')

   return {
      products: productsData || [],
      productsError,
   }
}

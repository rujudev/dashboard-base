import { Box, CircularProgress } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import CategoryIcon from '@mui/icons-material/Category'
import Categories from './Categories'
import { supabase } from '../../config/supabase-client'
import Metrics from '../Metrics'
import { mapCategoriesArray } from '../../utils/categories'
import ParentHeader from '../ParentHeader'

export default function Layout() {
   const { categories: dataCategories } = useLoaderData()
   const [categories, setCategories] = useState([])
   const [loading, setLoading] = useState(true)

   const categoryMetrics = [
      {
         title: 'Total categorías activas',
         value: categories.filter((category) => category.isActive).length,
      },
      {
         title: 'Total categorías con descuento',
         value: categories.filter((category) => category.voucherCode?.code).length,
      },
      {
         title: 'Total categorías con descuentos activos',
         value: categories.filter((category) => category.voucherCode?.code && category.voucherCode?.isActiveInCategory)
            .length,
      },
      {
         title: 'Total categorías con descuentos desactivados',
         value: categories.filter((category) => category.voucherCode?.code && !category.voucherCode?.isActiveInCategory)
            .length,
      },
   ]

   const handleRemoveCategory = async (categoryId) => {
      await supabase
         .from('products')
         .update([{ category_id: null }])
         .eq('category_id', categoryId)

      const { error: removeCategoryError } = await supabase.from('categories').delete().select().eq('id', categoryId)

      if (!removeCategoryError) {
         const newCategoriesList = dataCategories.filter((category) => category.id !== categoryId)
         setCategories(newCategoriesList)
      }
   }

   const handleUpdateIsActiveCategory = async (isChecked, categoryId) => {
      const { error: updateCategoryError } = await supabase
         .from('categories')
         .update({ is_active: isChecked })
         .eq('id', categoryId)

      if (!updateCategoryError) {
         const { data: updatedCategoriesData } = await supabase.from('categories').select()

         const mappedCategories = await mapCategoriesArray(updatedCategoriesData)
         setCategories(mappedCategories)
      }
   }

   useEffect(() => {
      if (!dataCategories) return

      setCategories(dataCategories)
      setLoading(false)
   }, [])

   return (
      <Box
         display='grid'
         gridTemplateColumns='max-content 1fr max-content'
         gridTemplateRows='max-content max-content 1fr'
         rowGap={3}
         gridTemplateAreas={`
               "page-name . add-category"
               "metrics metrics metrics"
               "category-list category-list category-list"
            `}
         width='100%'
         height='100%'
      >
         <ParentHeader
            buttonGridArea='add-category'
            PageIcon={CategoryIcon}
            title='Categorías'
            buttonText='Añadir nueva categoría'
            buttonToPath='/categories/create'
         />
         {!loading ? (
            <>
               <Metrics gridArea='metrics' dataSet={categoryMetrics} />
               <Box gridArea='category-list'>
                  <Categories
                     data={categories}
                     onUpdate={handleUpdateIsActiveCategory}
                     onRemove={handleRemoveCategory}
                  />
               </Box>
            </>
         ) : (
            <CircularProgress />
         )}
      </Box>
   )
}

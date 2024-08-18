import Inventory from '@mui/icons-material/Inventory'
import { Box, CircularProgress, useTheme } from '@mui/material'
import React, { useEffect, useState, useMemo } from 'react'
import Products from './Products'
import { useLoaderData } from 'react-router-dom'
import { supabase } from '../../config/supabase-client'
import Metrics from '../Metrics'
import ParentHeader from '../ParentHeader'
import MetricInfo from '../MetricInfo'

export default function Layout() {
   const data = useLoaderData()
   const theme = useTheme()
   const [products, setProducts] = useState([])
   const [isHiddenProducts, setIsHiddenProducts] = useState({
      total: 0,
      products: [],
   })
   const [productsWithNoStock, setProductsWithNoStock] = useState({
      total: 0,
      products: [],
   })
   const [productsToReplenish, setProductsToReplenish] = useState({
      total: 0,
      products: [],
   })
   const [loading, setLoading] = useState(true)
   const [isHiddenAnchorEl, setIsHiddenAnchorEl] = useState(null)
   const openIsHiddenAnchorEl = Boolean(isHiddenAnchorEl)
   const [noStockAnchorEl, setNoStockAnchorEl] = useState(null)
   const openNoStockAnchorEl = Boolean(noStockAnchorEl)
   const [replenishAnchorEl, setReplenishAnchorEl] = useState(null)
   const openReplenishAnchorEl = Boolean(replenishAnchorEl)

   const handleUpdateProductsList = (updatedProductsList) => {
      setProducts(updatedProductsList)
   }

   const handleOpenIsHiddenPopover = (event) => {
      setIsHiddenAnchorEl(event.currentTarget)
   }

   const handleCloseIsHiddenPopover = () => {
      setIsHiddenAnchorEl(null)
   }

   const handleOpenNoStockPopover = (event) => {
      setNoStockAnchorEl(event.currentTarget)
   }

   const handleCloseNoStockPopover = () => {
      setNoStockAnchorEl(null)
   }

   const handleOpenReplenishPopover = (event) => {
      setReplenishAnchorEl(event.currentTarget)
   }

   const handleCloseReplenishPopover = () => {
      setReplenishAnchorEl(null)
   }

   const toggleVisibility = async (id) => {
      const { error: errorProductData, data: productData } = await supabase
         .from('products')
         .select('is_hidden')
         .single()
         .eq('id', id)

      if (errorProductData) return

      const { is_hidden: productIsHidden } = productData
      const { error: errorUpdateProducts } = await supabase
         .from('products')
         .update({ is_hidden: !productIsHidden })
         .eq('id', id)
      const { error: errorProductsData, data: productsData } = await supabase.from('products').select()

      if (!errorUpdateProducts && !errorProductsData) {
         setProducts(productsData)
      }
   }

   useEffect(() => {
      const { products } = data

      supabase
         .from('categories')
         .select('id, name')
         .then(({ data: categories }) => {
            setProducts(() => {
               return products.map((product) => {
                  const { category_id: categoryId } = product
                  const categoryName = categories.find((category) => category.id === categoryId)?.name

                  return {
                     ...product,
                     ...(categoryName && { category: categoryName }),
                  }
               })
            })

            setLoading(false)
         })
   }, [])

   useEffect(() => {
      setIsHiddenProducts(() => {
         const isHiddenProducts = products.filter((product) => product.is_hidden)

         return {
            total: isHiddenProducts.length,
            products: isHiddenProducts,
         }
      })

      setProductsWithNoStock(() => {
         const productsWithNoStock = products.filter((product) => product.stock === 0)

         return {
            total: productsWithNoStock.length,
            products: productsWithNoStock,
         }
      })

      setProductsToReplenish(() => {
         const productsToReplenish = products.filter((product) => product.stock > 0 && product.stock < 10)

         return {
            total: productsToReplenish.length,
            products: productsToReplenish,
         }
      })
   }, [products])

   const productMetrics = [
      {
         title: 'Total productos',
         value: products.length,
         color: 'inherit',
         element: null,
      },
      {
         title: 'Ocultos',
         value: isHiddenProducts.total,
         color: isHiddenProducts.total > 0 ? theme.palette.warning.main : 'inherit',
         element: isHiddenProducts.total > 0 && (
            <MetricInfo
               data={isHiddenProducts.products}
               anchorEl={isHiddenAnchorEl}
               open={openIsHiddenAnchorEl}
               iconColor={theme.palette.error.main}
               onChangeOpen={handleOpenIsHiddenPopover}
               onChangeClose={handleCloseIsHiddenPopover}
               onChangeHide={toggleVisibility}
            />
         ),
      },
      {
         title: 'Sin stock',
         value: productsWithNoStock.total,
         color: productsWithNoStock.total > 0 ? theme.palette.error.main : 'inherit',
         element: productsWithNoStock.total > 0 && (
            <MetricInfo
               data={productsWithNoStock.products}
               anchorEl={noStockAnchorEl}
               open={openNoStockAnchorEl}
               iconColor={theme.palette.error.main}
               onChangeOpen={handleOpenNoStockPopover}
               onChangeClose={handleCloseNoStockPopover}
            />
         ),
      },
      {
         title: 'Para reponer',
         value: productsToReplenish.total,
         color:
            productsToReplenish.total > 0 || productsToReplenish.length <= 10 ? theme.palette.error.main : 'inherit',
         element: productsToReplenish.total > 0 && productsToReplenish.total <= 10 && (
            <MetricInfo
               data={productsToReplenish.products}
               anchorEl={replenishAnchorEl}
               open={openReplenishAnchorEl}
               iconColor={theme.palette.error.main}
               onChangeOpen={handleOpenReplenishPopover}
               onChangeClose={handleCloseReplenishPopover}
            />
         ),
      },
   ]

   return (
      <Box
         display='grid'
         gridTemplateColumns='max-content 1fr max-content'
         gridTemplateRows='repeat(4, max-content)'
         rowGap={3}
         gridTemplateAreas={`
               "page-name . add-product"
               ". loading ."
               "metrics metrics metrics"
               "product-list product-list product-list"
            `}
         alignItems='center'
         width='100%'
         height='100%'
      >
         <ParentHeader
            buttonGridArea='add-product'
            PageIcon={Inventory}
            title='Productos'
            buttonText='Añadir nuevo producto'
            buttonToPath='/products/create'
         />
         {!loading ? (
            <>
               <Metrics gridArea='metrics' dataSet={productMetrics} />
               <Box gridArea='product-list'>
                  <Products products={products} onUpdateProductsList={handleUpdateProductsList} loading={loading} />
               </Box>
            </>
         ) : (
            <Box gridArea='loading' display='flex' justifyContent='center'>
               <CircularProgress />
            </Box>
         )}
      </Box>
   )
}

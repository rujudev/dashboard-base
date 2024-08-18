import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import App from '../App'

import ProductsLayout from '../components/products/Layout'
import CategoriesLayout from '../components/categories/Layout'
import VoucherCodesLayout from '../components/voucher-codes/Layout'

import productLoader from '../loaders/products/product'
import productsLoader from '../loaders/products/products'
import categoriesLoader from '../loaders/categories/categories'
import categoryLoader from '../loaders/categories/category'
import voucherCodesLoader from '../loaders/voucher-codes/voucher-codes'
import voucherCodeLoader from '../loaders/voucher-codes/voucher-code'

import SignIn from '../components/SignIn'
import Product from '../components/products/Product'
import Category from '../components/categories/Category'
import VoucherCode from '../components/voucher-codes/VoucherCode'

export const router = createBrowserRouter(
   [
      {
         path: '/sign-in',
         action: () => {},
         element: <SignIn />,
      },
      {
         path: '/',
         element: <App />,
         children: [
            {
               index: true,
               path: 'products',
               loader: productsLoader,
               element: <ProductsLayout />,
            },
            {
               path: 'products/create',
               loader: productLoader,
               element: <Product />,
            },
            {
               path: 'products/:id/edit',
               loader: productLoader,
               element: <Product />,
            },
            {
               path: 'voucher-codes',
               loader: voucherCodesLoader,
               element: <VoucherCodesLayout />,
            },
            {
               path: 'voucher-codes/create',
               loader: voucherCodeLoader,
               element: <VoucherCode />,
            },
            {
               path: 'voucher-codes/:id/edit',
               loader: voucherCodeLoader,
               element: <VoucherCode />,
            },
            {
               path: 'categories',
               loader: categoriesLoader,
               element: <CategoriesLayout />,
            },
            {
               path: 'categories/create',
               loader: categoryLoader,
               element: <Category />,
            },
            {
               path: 'categories/:id/edit',
               loader: categoryLoader,
               element: <Category />,
            },
         ],
      },
   ],
   { basename: '/' }
)

/* eslint-disable camelcase */
import { useState, useEffect } from 'react'
import { Form, useLoaderData, useLocation, useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { supabase } from '../../config/supabase-client'

// Material UI components
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// Cusom Components
import Select from '../Select'
import Switch from '../Switch'
import ChildHeader from '../ChildHeader'
import SubCategories from './sub-categories/SubCategories'
import Thumbnail from '../image/Thumbnail'

import { preventDefaultEnterKey } from '../../utils/form'
import { uploadImages } from '../../utils/images'
import { getNonDeletedSubCategories, getNonDeletedSubCategoryTags } from '../../utils/categories'

export default function Category() {
   const { category } = useLoaderData()
   const navigate = useNavigate()
   const { enqueueSnackbar } = useSnackbar()

   const { pathname } = useLocation()
   const [loading, setLoading] = useState(false)
   const [name] = useState(category?.name || '')
   const [subCategories, setSubCategories] = useState(category?.subCategories || [])
   const [voucherCodes, setVoucherCodes] = useState([])
   const [voucherCode, setVoucherCode] = useState(category?.voucherCode)
   const [isActive, setIsActive] = useState(category?.isActive || true)
   const [isActiveCategoryVoucherCode, setIsActiveCategoryVoucherCode] = useState(
      category?.isActiveCategoryVoucherCode || false
   )
   const [thumbnail, setThumbnail] = useState(category?.thumbnail || null)

   const customOptions = [
      <Switch
         key='is-active-option'
         name='is-active'
         checked={isActive}
         onChange={() => setIsActive((prevIsActive) => !prevIsActive)}
         label='Activa'
      />,
      <Switch
         key='is-active-category-voucher-code-option'
         name='is-active-category-voucher-code'
         checked={isActiveCategoryVoucherCode}
         onChange={() =>
            setIsActiveCategoryVoucherCode((prevIsActiveCategoryVoucherCode) => !prevIsActiveCategoryVoucherCode)
         }
         label='Activar descuento'
      />,
   ]

   useEffect(() => {
      const { voucherCode } = category

      supabase
         .from('voucher-codes')
         .select('id, code')
         .then(({ data, error }) => {
            if (!error) {
               const mapVoucherCodes = data.map((voucherCode) => ({ id: voucherCode.id, name: voucherCode.code }))
               setVoucherCodes(mapVoucherCodes)
            }
         })

      if (category?.voucherCode) {
         supabase
            .from('voucher-codes')
            .select('id')
            .eq('id', voucherCode)
            .single()
            .then(({ data: voucherCodeData, error: voucherCodeError }) => {
               if (!voucherCodeError) {
                  const { id: voucherCodeId } = voucherCodeData

                  setVoucherCode(voucherCodeId)
               }
            })
      }
   }, [])

   const handleSubmit = async (e) => {
      e.preventDefault()
      setLoading(true)

      const formData = new FormData(e.target)

      const formNameData = formData.get('name')

      let data = {
         name: formNameData,
         is_active: isActive,
         is_active_category_voucher_code: isActiveCategoryVoucherCode,
      }

      if (voucherCode) {
         data = {
            ...data,
            voucher_code: voucherCode,
         }

         if (category.voucherCode !== null && category.voucherCode !== data.voucher_code) {
            supabase
               .from('voucher-codes')
               .update([{ is_general: true }])
               .eq('id', category.voucherCode)
               .then(async () => {
                  await supabase
                     .from('voucher-codes')
                     .update([{ is_general: false }])
                     .eq('id', data.voucher_code)
               })
         } else {
            await supabase
               .from('voucher-codes')
               .update([{ is_general: false }])
               .eq('id', data.voucher_code)
         }
      }

      const paths = (prefix) => ({
         thumbnail: `${prefix}/thumbnail`,
         subCategories: `${prefix}/sub-categories`,
      })

      if (pathname.includes('create')) {
         const { data: insertCategoryData, error: insertCategoryError } = await supabase
            .from('categories')
            .insert([{ ...data }])
            .select()
            .single()

         if (!insertCategoryError) {
            const { id: insertedCategoryId } = insertCategoryData
            const { newCategoryThumbnail, newCategorySubCategories } = await uploadAndAssignImages(
               paths(`categories/${insertedCategoryId}`)
            )

            data = {
               ...data,
               thumbnail: newCategoryThumbnail,
               sub_categories: newCategorySubCategories ?? [],
            }

            const result = await supabase
               .from('categories')
               .update([{ ...data }])
               .eq('id', insertedCategoryId)
               .select()
               .single()

            setLoading(false)
            return navigate(`/categories/${insertedCategoryId}/edit`)
         }

         setLoading(false)
         return enqueueSnackbar('No ha sido posible guardar la categoría', { variant: 'error' })
      }

      if (pathname.includes('edit')) {
         await removeImagesDeletedSubCategoriesAndTags(category.id)
         const { newCategoryThumbnail, newCategorySubCategories } = await uploadAndAssignImages(
            paths(`categories/${category.id}`)
         )

         data = {
            ...data,
            thumbnail: newCategoryThumbnail ?? thumbnail,
            sub_categories: newCategorySubCategories,
         }

         await supabase
            .from('categories')
            .update([{ ...data }])
            .eq('id', category.id)
            .select()
            .single()

         setLoading(false)
         enqueueSnackbar(`Categoría "${category.name}" actualizada`, { variant: 'success' })
         return navigate(`/categories/${category.id}/edit`)
      }
   }

   const uploadAndAssignImages = async (paths) => {
      const { thumbnail: thumbnailPath, subCategories: subCategoriesPath } = paths
      const categoryThumbnailFile = thumbnail?.file ?? null
      let data = {
         thumbnail: null,
      }

      if (categoryThumbnailFile) {
         const { data: uploadThumbnailData } = await uploadImages(thumbnailPath, { file: categoryThumbnailFile })
         const newThumbnail = uploadThumbnailData ?? null

         data = {
            ...data,
            thumbnail: newThumbnail,
            subCategories: [],
         }
      }

      if (subCategories.length > 0) {
         const nonDeletedSubCategories = getNonDeletedSubCategories(subCategories)

         data = {
            ...data,
            subCategories: nonDeletedSubCategories,
         }

         if (nonDeletedSubCategories.length > 0) {
            let newSubCategoriesData = []

            for (const subCategory of nonDeletedSubCategories) {
               const subCategoryId = subCategory.id
               const subCategoryName = subCategory.name
               const subCategoryThumbnailFile = subCategory.thumbnail?.file ?? null

               let newSubCategoryData = {
                  id: subCategoryId,
                  name: subCategoryName,
               }

               if (subCategoryThumbnailFile) {
                  const { data: uploadSubCategoryThumbnailData, error: uploadSubCategoryThumbnailError } =
                     await uploadImages(`${subCategoriesPath}/${subCategoryId}/thumbnail`, {
                        file: subCategoryThumbnailFile,
                     })

                  if (!uploadSubCategoryThumbnailError && uploadSubCategoryThumbnailData) {
                     newSubCategoryData = {
                        ...newSubCategoryData,
                        thumbnail: uploadSubCategoryThumbnailData,
                     }
                  }
               } else {
                  const subCategoryThumbnail = subCategory.thumbnail

                  newSubCategoryData = {
                     ...newSubCategoryData,
                     thumbnail: subCategoryThumbnail,
                  }
               }

               let newSubCategoryTags = []

               if (subCategory.tags && subCategory.tags.length > 0) {
                  const nonDeletedSubCategoriesTags = getNonDeletedSubCategoryTags(subCategory.tags)

                  if (nonDeletedSubCategoriesTags.length > 0) {
                     for (const tag of nonDeletedSubCategoriesTags) {
                        const tagId = tag.id
                        const tagName = tag.name
                        const tagThumbnailFile = tag.thumbnail?.file ?? null

                        let newSubCategoryTagData = {
                           id: tagId,
                           name: tagName,
                        }

                        if (tagThumbnailFile) {
                           const { data: uploadTagThumbnailData, error: uploadTagThumbnailError } = await uploadImages(
                              `${subCategoriesPath}/${subCategoryId}/tags/${tag.id}`,
                              { file: tagThumbnailFile }
                           )

                           if (!uploadTagThumbnailError && uploadTagThumbnailData) {
                              newSubCategoryTagData = {
                                 ...newSubCategoryTagData,
                                 thumbnail: uploadTagThumbnailData,
                              }
                           }
                        } else {
                           const tagThumbnail = tag.thumbnail

                           newSubCategoryTagData = {
                              ...newSubCategoryTagData,
                              thumbnail: tagThumbnail,
                           }
                        }

                        newSubCategoryTags = [...newSubCategoryTags, newSubCategoryTagData]
                     }

                     newSubCategoryData = {
                        ...newSubCategoryData,
                        tags: newSubCategoryTags,
                     }
                  }
               }

               newSubCategoriesData = [...newSubCategoriesData, newSubCategoryData]
            }

            data = {
               ...data,
               subCategories: newSubCategoriesData,
            }
         }
      }

      return { newCategoryThumbnail: data.thumbnail, newCategorySubCategories: data.subCategories }
   }

   const removeImagesDeletedSubCategoriesAndTags = async (categoryId) => {
      const deletedSubCategories = subCategories.filter((subCategory) => subCategory?.deleted)
      let pathsToRemove = []

      if (deletedSubCategories.length > 0) {
         for (const deletedSubCategory of deletedSubCategories) {
            const subCategoryTags = deletedSubCategory.tags ?? []
            const subCategoryThumbnail = deletedSubCategory.thumbnail ?? null

            if (subCategoryThumbnail) {
               pathsToRemove = [
                  ...pathsToRemove,
                  `categories/${categoryId}/sub-categories/${deletedSubCategory.id}/thumbnail/${subCategoryThumbnail.name}`,
               ]
            }

            if (subCategoryTags.length > 0) {
               for (const subCategoryTag of subCategoryTags) {
                  const tagThumbnail = subCategoryTag.thumbnail ?? null

                  if (tagThumbnail) {
                     pathsToRemove = [
                        ...pathsToRemove,
                        `categories/${categoryId}/sub-categories/${deletedSubCategory.id}/tags/${subCategoryTag.id}/${tagThumbnail.name}`,
                     ]
                  }
               }
            }
         }
      }

      const subCategoryDeletedTags = subCategories
         .map((subCategory) => {
            if (subCategory.tags && subCategory.tags.length > 0) {
               const deletedTags = subCategory.tags.filter((tag) => tag?.deleted)

               return {
                  subCategoryId: subCategory.id,
                  tags: deletedTags,
               }
            }

            return null
         })
         .filter((subCategory) => subCategory !== null)

      if (subCategoryDeletedTags.length > 0) {
         for (const subCategoryDeletedTag of subCategoryDeletedTags) {
            const { subCategoryId, tags } = subCategoryDeletedTag

            for (const tag of tags) {
               const { id: tagId, thumbnail: tagThumbnail } = tag

               if (tagThumbnail) {
                  pathsToRemove = [
                     ...pathsToRemove,
                     `categories/${categoryId}/sub-categories/${subCategoryId}/tags/${tagId}/${tagThumbnail.name}`,
                  ]
               }
            }
         }
      }

      if (pathsToRemove.length > 0) await supabase.storage.from('images').remove(pathsToRemove)
   }

   const handleChangeVoucherCode = (e) => {
      const { value } = e.target

      setVoucherCode(value)
   }

   const handleSelectThumbnail = (event) => {
      const file = event.target.files[0]

      const name = file.name
      const url = URL.createObjectURL(file)

      setThumbnail({ file, url, name })
   }

   const handleRemoveThumbnail = () => {
      setThumbnail(null)
   }

   const handleSaveSubCategory = (subCategory) => {
      setSubCategories((prevSubCategories) => [...prevSubCategories, subCategory])
   }

   const handleUpdateSubCategory = (subCategory) => {
      setSubCategories((prevSubCategories) => {
         let subCategoryFound = prevSubCategories.find((subCategoryFound) => subCategoryFound.id === subCategory.id)

         if (!subCategoryFound) return prevSubCategories

         subCategoryFound = {
            ...subCategoryFound,
            ...subCategory,
         }

         const subCategoryIndex = prevSubCategories.findIndex(
            (prevSubCategory) => prevSubCategory.id === subCategoryFound.id
         )
         const newSubCategories = [...prevSubCategories]
         newSubCategories.splice(subCategoryIndex, 1, subCategoryFound)

         return newSubCategories
      })
   }

   const handleRemoveSubCategory = (id) => {
      setSubCategories((prevSubCategories) => {
         return prevSubCategories.map((subCategory) =>
            subCategory.id === id ? { ...subCategory, deleted: true } : subCategory
         )
      })
   }

   return (
      <>
         <Box
            component={Form}
            onSubmit={handleSubmit}
            method='post'
            onKeyDown={preventDefaultEnterKey}
            display='grid'
            gridTemplateColumns='max-content 1fr max-content'
            gridTemplateRows='max-content max-content 1fr'
            rowGap={4}
            columnGap={2}
            gridTemplateAreas={`
                  'header header header'
                  'category-name . .'
                  'layout layout layout'
               `}
            width='100%'
         >
            <ChildHeader
               gridArea='header'
               onNavigateTo={() => navigate('/categories')}
               loading={loading}
               options={customOptions}
            />
            <Box gridArea='category-name' display='flex' gap={1}>
               {pathname.includes('create') ? (
                  <Typography variant='h2' fontSize='25px' fontWeight='bold'>
                     Nueva categoría
                  </Typography>
               ) : (
                  <>
                     <Typography variant='h2' fontSize='25px' fontWeight='bold'>
                        Nombre:
                     </Typography>
                     <Typography component='span' variant='h2' fontSize='25px' fontStyle='italic'>
                        {category.name}
                     </Typography>
                  </>
               )}
            </Box>
            <Box
               gridArea='layout'
               display='grid'
               justifyContent='space-between'
               gridTemplateColumns='1fr max-content'
               gridTemplateAreas={`
                  'info thumbnail'
               `}
               gap={2}
            >
               <Box gridArea='thumbnail'>
                  <Thumbnail
                     url={thumbnail?.url}
                     name={thumbnail?.name}
                     onChange={handleSelectThumbnail}
                     onRemove={handleRemoveThumbnail}
                     orientation='vertical'
                     width={160}
                     height={160}
                  />
               </Box>
               <Box
                  display='grid'
                  gridTemplateColumns='repeat(2, minmax(250px, 1fr))'
                  gridTemplateRows='max-content max-content'
                  gridTemplateAreas={`
                     'name voucher-code'
                     'sub-categories sub-categories'
                  `}
                  gridArea='info'
                  alignItems='center'
                  columnGap={{ xs: 3 }}
                  rowGap={{ xs: 3 }}
               >
                  <Box gridArea='name'>
                     <TextField id='name' name='name' label='Nombre' defaultValue={name} fullWidth />
                  </Box>
                  <Box gridArea='voucher-code'>
                     <Select
                        label='Código de descuento'
                        defaultValueText={
                           voucherCodes.length === 0
                              ? 'No hay códigos de descuento'
                              : 'Selecciona un código de descuento'
                        }
                        name='voucher-code'
                        items={voucherCodes}
                        value={voucherCode}
                        onChange={handleChangeVoucherCode}
                        disabled={!isActiveCategoryVoucherCode}
                        fullWidth
                        required
                     />
                  </Box>
                  <Box gridArea='sub-categories' display='flex' flexDirection='column' gap={2}>
                     <SubCategories
                        data={subCategories}
                        onSave={handleSaveSubCategory}
                        onUpdate={handleUpdateSubCategory}
                        onRemove={handleRemoveSubCategory}
                     />
                  </Box>
               </Box>
            </Box>
         </Box>
      </>
   )
}

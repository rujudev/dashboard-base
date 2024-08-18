/* eslint-disable camelcase */
import { useEffect, useState } from 'react'
import { Form, useLoaderData, useNavigate, useResolvedPath } from 'react-router-dom'
import { supabase } from '../../config/supabase-client'

import MDEditor from '@uiw/react-md-editor'

// Custom components
import CurrencyTextField from '../CurrencyTextField'
import Select from '../Select'
import ChildHeader from '../ChildHeader'

// Material UI components
// TODO: Use ActionComponent custom Component instead ButtonGroup
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'

import { preventDefaultEnterKey } from '../../utils/form'
import { useSnackbar } from 'notistack'
import Switch from '../Switch'
import Packs from '../packs/Packs'
import usePrice from '../../hooks/usePrice'
import NewPack from '../packs/NewPack'
import NewFormat, { NEW_FORMAT } from '../formats/NewFormat'
import Formats from '../formats/Formats'
import { formatDiscount, formatString } from '../../utils'
import { uploadImages } from '../../utils/images'
import ProductSubCategories from './SubCategories'
import { ImageGallery } from '../image/Gallery'

export const MAX_LIST_IMAGE_SIZE = 6

export default function Product() {
   const { product, categories } = useLoaderData()

   const { pathname } = useResolvedPath()
   const { enqueueSnackbar } = useSnackbar()
   const navigate = useNavigate()

   // TODO: arreglar eliminar imagenes de la galleria
   // TODO: use useReducer to control the state
   const { getPriceByQuantity, getPriceWithDiscount } = usePrice({
      initialPrice: product?.price || 0,
   })
   const [name] = useState(product?.name || '')
   const [category, setCategory] = useState(product?.category || null)
   const [productSubCategories, setProductSubCategories] = useState(product?.subCategories || [])
   const [price, setPrice] = useState(product?.price || 0)
   const [withDiscount, setWithDiscount] = useState(product?.withDiscount || false)
   const [discount, setDiscount] = useState(product?.discount || '')
   const [stock, setStock] = useState(product?.stock || '')
   const [imgGallery, setImgGallery] = useState(product?.imgGallery || [])
   const [description, setDescription] = useState(product?.description || '')
   const [loading, setLoading] = useState(false)
   const [reviews] = useState(product?.reviews || [])
   const [formats, setFormats] = useState(product?.formats || [])
   const [packs, setPacks] = useState(product?.packs || [])
   const [newFormat, setNewFormat] = useState(NEW_FORMAT)
   const [newPack, setNewPack] = useState({
      id: '',
      isActive: true,
      quantity: 0,
      discount: 0,
      total_price: 0,
      total_price_with_discount: 0,
   })
   const [isUpdatingPack, setIsUpdatingPack] = useState(false)

   const [withFormats, setWithFormats] = useState(product?.withFormats || false)
   const [withPacks, setWithPacks] = useState(product?.withPacks || false)
   const [openAddNewPack, setOpenAddNewPack] = useState(false)
   const [openAddNewFormat, setOpenAddNewFormat] = useState(false)

   useEffect(() => {
      if (price && withPacks) {
         setPacks((prevPacks) => {
            return prevPacks.map((pack) => {
               return {
                  id: pack.id,
                  isActive: pack.isActive,
                  quantity: pack.quantity,
                  discount: pack.discount,
                  total_price: getPriceByQuantity(price, pack.quantity),
                  total_price_with_discount: getPriceWithDiscount(price, pack.discount, pack.quantity),
               }
            })
         })
      }
   }, [price, withPacks])

   useEffect(() => {
      if (withFormats && formats.length > 0) {
         setStock(() => {
            return formats.reduce((acc, size) => acc + size.stock, 0)
         })
      }
   }, [withFormats, formats])

   const toggleWithProductDiscount = () => {
      setWithDiscount(!withDiscount)
   }

   const toggleWithFormats = () => {
      setWithFormats(!withFormats)
      withPacks && setWithPacks(false)
      withDiscount && toggleWithProductDiscount()
   }

   const toggleWithPacks = () => {
      setWithPacks(!withPacks)
      withFormats && setWithFormats(false)
      withDiscount && toggleWithProductDiscount()
   }

   const customOptions = [
      <Switch
         key='formats-option'
         name='formats'
         checked={withFormats}
         onChange={toggleWithFormats}
         label='Por formatos'
         disabled={withDiscount || withPacks}
      />,
      <Switch
         key='packs-option'
         name='packs'
         checked={withPacks}
         onChange={toggleWithPacks}
         disabled={withDiscount || withFormats}
         label='Por packs de unidades'
      />,
      <Switch
         key='add-discount-option'
         name='packs'
         checked={withDiscount}
         onChange={toggleWithProductDiscount}
         disabled={withPacks || withFormats}
         label='Añadir descuento'
      />,
   ]

   const gridRepeatColumns = 4

   const commonProductGridTemplateAreas = `
      '${`image-gallery `.repeat(gridRepeatColumns).trim()}'
      '${`description `.repeat(gridRepeatColumns).trim()}'
      '${`reviews `.repeat(gridRepeatColumns).trim()}'
   `

   const withOrWithoutDiscountProductGridTemplateAreas = category
      ? `
      'price price ${withDiscount ? `discount total-price-with-discount` : `. .`}'
      'sub-categories sub-categories sub-categories sub-categories'
   `
      : `'price price ${withDiscount ? `discount total-price-with-discount` : `. .`}'`

   const withPacksProductGridTemplateAreas = category
      ? `
      'price price . .'
      'sub-categories sub-categories sub-categories sub-categories'
      'packs packs packs packs'
   `
      : `'price price . .'\n'packs packs packs packs'`

   const withFormatsProductGridTemplateAreas = category
      ? `
      'sub-categories sub-categories sub-categories sub-categories'
      'formats formats formats formats'
   `
      : `'formats formats formats formats'`

   const handleOnSubmit = async (e) => {
      e.preventDefault()

      const formData = new FormData(e.target)

      const priceFormInputValue = formData.get('price') || 0
      const discountFormInputValue = formData.get('discount')

      const parsedPrice = priceFormInputValue && parseFloat(formatString(priceFormInputValue))
      const parsedDiscount = formatDiscount(discountFormInputValue)

      // TODO: add to data when we are working on them
      // const reviewIds = reviews.map((review) => String(review.id))
      // ...(reviewIds.length > 0 && { review_ids: reviewIds }),

      let data = {
         price: parsedPrice,
         stock,
         with_discount: withDiscount,
         discount: parsedDiscount,
         sub_categories: productSubCategories,
         with_packs: withPacks,
         packs,
         formats,
         with_formats: withFormats,
      }

      for (const [key, value] of formData.entries()) {
         data = {
            [key]: value,
            ...data,
         }
      }

      setLoading(true)

      // Create new product
      if (pathname.includes('create')) {
         const { data: insertProductData, error: insertProductError } = await supabase
            .from('products')
            .insert([{ ...data }])
            .select()
            .single()

         if (!insertProductError) {
            const insertedProductId = insertProductData.id

            if (!withFormats && !withPacks) {
               if (imgGallery.length > 0) {
                  const { error, imgGallery, thumbnail } = await getDefaultProductUploadedImages(insertedProductId)

                  if (error) {
                     enqueueSnackbar(`Ha ocurrido un error al subir las imágenes`, {
                        variant: 'error',
                     })
                  }

                  data = {
                     ...data,
                     thumbnail,
                     img_gallery: imgGallery,
                  }
               }
            }

            if (withFormats) {
               const newFormats = await getProductFormatsUploadedImages(insertedProductId)

               data = {
                  ...data,
                  formats: newFormats,
               }
            }

            const { error: updateProductError, data: updateProductData } = await supabase
               .from('products')
               .update([{ ...data }])
               .eq('id', insertedProductId)
               .select()
               .single()

            setLoading(false)
            return navigate(`/products/${insertedProductId}/edit`)
         }

         setLoading(false)
         return enqueueSnackbar(`No ha sido posible guardar el producto`, { variant: 'error' })
      }

      // Update existing product
      if (pathname.includes('edit')) {
         if (!withFormats && !withPacks) {
            const { error, imgGallery, thumbnail } = await getDefaultProductUploadedImages(product.id)

            if (error) {
               enqueueSnackbar(`Ha ocurrido un error al subir las imágenes`, {
                  variant: 'error',
               })
            }

            data = {
               ...data,
               thumbnail: thumbnail ?? null,
               img_gallery: imgGallery,
            }
         }

         if (withFormats) {
            const newFormats = await getProductFormatsUploadedImages(product.id)

            data = {
               ...data,
               formats: newFormats,
            }
         }

         const { error: updateProductError, data: updateProductData } = await supabase
            .from('products')
            .update([{ ...data }])
            .eq('id', product.id)
            .select()
            .single()

         setLoading(false)
         enqueueSnackbar(`El producto "${product.name}", ha sido actualizado`, {
            variant: 'success',
         })
      }
   }

   const getDefaultProductUploadedImages = async (productId) => {
      const { error, data: newImgGallery } = await uploadImages(`products/${productId}/img_gallery`, imgGallery)

      if (newImgGallery.length > 0) {
         let imagesData = {
            imgGallery: newImgGallery,
         }

         const newThumbnail = newImgGallery.find((img) => img.isThumbnail) ?? null

         if (newThumbnail) {
            imagesData = {
               ...imagesData,
               thumbnail: newThumbnail,
            }
         }

         return {
            error,
            ...imagesData,
         }
      }

      return {
         error,
         imgGallery: [],
      }
   }

   const getProductFormatsUploadedImages = async (productId) => {
      let formatsAux = []

      for (const format of formats) {
         const { imgGallery } = format

         if (imgGallery.length > 0) {
            const { error, data: formatImgGallery } = await uploadImages(
               `products/${productId}/formats/${format.id}`,
               imgGallery
            )

            if (error) {
               enqueueSnackbar(`Ha ocurrido un error al subir las imágenes`, {
                  variant: 'error',
               })
            }

            if (formatImgGallery.length > 0) {
               const updatedImgGalleryFormat = { ...format, imgGallery: formatImgGallery }
               formatsAux = [...formatsAux, updatedImgGalleryFormat]
            }
         }
      }

      return formatsAux.length > 0 ? formatsAux : formats
   }

   const handleChangeImgGallery = (files) => {
      const slicedFiles = files.slice(0, MAX_LIST_IMAGE_SIZE)

      setImgGallery((prevImgGallery) => {
         let nextImgGallery = [...prevImgGallery]

         for (const file of slicedFiles) {
            const id = new Date().getTime() + Math.floor(Math.random() * 10000)
            const url = URL.createObjectURL(file)

            if (nextImgGallery.length === MAX_LIST_IMAGE_SIZE) return nextImgGallery

            nextImgGallery = [...nextImgGallery, { id, isThumbnail: false, name: file.name, url, file }]
         }

         return nextImgGallery
      })
   }

   const handleSelectImages = (event) => {
      const { files: targetFiles } = event.target
      const files = Array.from(targetFiles)

      handleChangeImgGallery(files)
   }

   const handleChangePrice = (event) => {
      const { value } = event.target

      setPrice(value)
   }

   const handleChangeDescription = (text) => {
      setDescription(text)
   }

   const handleSelectThumbnail = (id) => {
      setImgGallery((prevImgGallery) => {
         return prevImgGallery.map((img) => {
            return {
               ...img,
               isThumbnail: img.id === id,
            }
         })
      })
   }

   const handleDeleteImage = (id) => {
      setImgGallery((prevImgGallery) => {
         return prevImgGallery.filter((img) => img.id !== id)
      })
   }

   const handleChangeCategory = (event) => {
      const { value: categoryIdValue } = event.target
      const categoryFound = categories.find((category) => category.id === categoryIdValue)

      if (categoryFound) {
         const { sub_categories: subCategories, ...restOfProps } = categoryFound

         setCategory({
            ...restOfProps,
            subCategories: categoryFound.sub_categories,
         })
      }
   }

   const handleUpdateSubCategories = (subCategories) => {
      setProductSubCategories(subCategories)
   }

   const toggleAddNewFormat = () => {
      setOpenAddNewFormat(!openAddNewFormat)
      setNewFormat(NEW_FORMAT)
   }

   const toggleAddNewPack = () => {
      setOpenAddNewPack(!openAddNewPack)
      setNewPack({
         id: packs.length,
         isActive: true,
         quantity: 0,
         discount: 0,
         total_price: 0,
         total_price_with_discount: 0,
      })
   }

   const handleChangeStock = (event, index = 0) => {
      const { value } = event.target
      const stock = Number(value)

      if (!withFormats) {
         setStock(stock)
      }

      if (withFormats) {
         const newFormats = [...formats]
         newFormats[index].stock = Number(stock)
         const totalStock = newFormats.reduce((acc, format) => acc + format.stock, 0)

         setStock(totalStock)
         setFormats(newFormats)
      }
   }

   const handleChangePackQuantity = (event) => {
      const { value } = event.target
      const newPackAux = { ...newPack }
      newPackAux.quantity = value
      setNewPack(newPackAux)
   }

   const handleChangeDiscount = (event, index = 0) => {
      const { value } = event.target

      if (!withFormats && !withPacks) {
         const formattedDiscount = formatDiscount(value)
         setDiscount(formattedDiscount)
      }

      if (withFormats) {
         const newFormats = [...formats]
         newFormats[index].discount = formatDiscount(value)
         setFormats(newFormats)
      }

      if (withPacks) {
         const newPackAux = { ...newPack }
         newPackAux.discount = formatDiscount(value)
         setNewPack(newPackAux)
      }
   }

   const handleSaveFormat = () => {
      setOpenAddNewFormat(!openAddNewFormat)
      setFormats((prevFormats) => [...prevFormats, newFormat])
   }

   const handleSavePack = () => {
      const total_price = newPack.quantity * price
      const total_price_with_discount = getPriceWithDiscount(price, newPack.discount, newPack.quantity)

      const pack = {
         ...newPack,
         total_price,
         ...(total_price_with_discount && { total_price_with_discount }),
      }

      setOpenAddNewPack(!openAddNewPack)
      setPacks((prevPacks) => [...prevPacks, pack])
   }

   const handleUpdateNewFormat = (updatedFormat) => {
      setNewFormat((prevNewFormat) => ({ ...prevNewFormat, ...updatedFormat }))
   }

   const handleUpdateFormat = (id, updatedPropsValues) => {
      setFormats((prevFormats) => {
         return prevFormats.map((format) => (format.id === id ? { ...format, ...updatedPropsValues } : format))
      })
   }

   // TODO: refactorizar igual que los Tamaños si funciona bien
   const handleUpdatePack = (id, updatedPropsValues) => {
      setPacks((prevPacks) => prevPacks.map((pack) => (pack.id === id ? { ...pack, ...updatedPropsValues } : pack)))
   }

   const toggleIsActiveFormat = (id) => {
      setFormats((prevFormats) => {
         return prevFormats.map((format) => (format.id === id ? { ...format, isActive: !format.isActive } : format))
      })
   }

   const handleToggleIsActivePack = (id) => {
      setPacks((prevPacks) => {
         return prevPacks.map((pack) => (pack.id === id ? { ...pack, isActive: !pack.isActive } : pack))
      })
   }

   const handleRemoveFormat = (id) => {
      setFormats((prevFormats) => {
         const newFormats = [...prevFormats]
         const index = newFormats.findIndex((format) => format.id === id)
         newFormats.splice(index, 1)

         const totalStock = newFormats.reduce((acc, format) => acc + format.stock, 0)

         setStock(totalStock)
         return newFormats
      })
   }

   const handleRemovePack = (index) => {
      setPacks((prevPacks) => {
         prevPacks.splice(index, 1)

         return prevPacks
      })
   }

   return (
      <Box
         component={Form}
         method='post'
         onSubmit={handleOnSubmit}
         onKeyDown={preventDefaultEnterKey}
         display='grid'
         gridTemplateColumns='max-content 1fr max-content'
         gridTemplateRows='max-content 1fr'
         rowGap={4}
         gridTemplateAreas={`
                  "header header header"
                  "product-id . ."
                  "product-layout product-layout product-layout"
               `}
         width='100%'
      >
         <ChildHeader
            gridArea='header'
            onNavigateTo={() => navigate('/products')}
            loading={loading}
            options={customOptions}
            disableButton={isUpdatingPack}
         />
         <Box gridArea='product-id' display='flex' gap={1}>
            {pathname.includes('create') ? (
               <Typography variant='h2' fontSize='25px' fontWeight='bold'>
                  Nuevo producto
               </Typography>
            ) : (
               <>
                  <Typography variant='h2' fontSize='25px' fontWeight='bold'>
                     ID de producto:
                  </Typography>
                  <Typography component='span' variant='h2' fontSize='25px' fontStyle='italic'>
                     {product?.id}
                  </Typography>
               </>
            )}
         </Box>
         <Box
            display='grid'
            gridTemplateColumns='repeat(4, 1fr)'
            gridTemplateRows='max-content max-content max-content 1fr max-content '
            gridTemplateAreas={`
               'name name category stock'
               ${!withFormats && !withPacks ? withOrWithoutDiscountProductGridTemplateAreas : ''}
               ${withPacks ? withPacksProductGridTemplateAreas : ''}
               ${withFormats ? withFormatsProductGridTemplateAreas : ''}
               ${commonProductGridTemplateAreas}
            `}
            gridArea='product-layout'
            alignItems='center'
            columnGap={{ xs: 3 }}
            rowGap={{ xs: 3 }}
         >
            <Box gridArea='name'>
               <TextField id='name' name='name' label='Nombre' defaultValue={name} fullWidth required />
            </Box>
            <Box gridArea='category'>
               <Select
                  label={`${categories.length === 0 ? 'No hay categorías creadas' : 'Categoría'}`}
                  name='category_id'
                  items={categories || []}
                  value={category?.id || ''}
                  onChange={handleChangeCategory}
                  disabled={categories.length === 0}
                  required={categories.length > 0}
                  defaultValueText='Selecciona una categoría'
                  fullWidth
               />
            </Box>
            {category && (
               <ProductSubCategories
                  gridArea='sub-categories'
                  category={category}
                  subCategories={productSubCategories}
                  onUpdate={handleUpdateSubCategories}
               />
            )}
            <Box gridArea='stock'>
               <TextField
                  id='stock'
                  label='Stock'
                  name='stock'
                  type='number'
                  value={stock || ''}
                  onChange={handleChangeStock}
                  disabled={withFormats}
                  fullWidth
                  required
               />
            </Box>
            {!withFormats && (
               <>
                  <Box gridArea='price'>
                     <CurrencyTextField
                        id='price'
                        name='price'
                        label='Precio'
                        value={price || ''}
                        onChange={handleChangePrice}
                        fullWidth
                        required
                     />
                  </Box>
                  <Box gridArea='image-gallery' display='flex' flexDirection='column' marginBottom='15px' rowGap={2}>
                     <ImageGallery
                        data={imgGallery}
                        onDelete={handleDeleteImage}
                        onDrop={handleChangeImgGallery}
                        onSelectImage={handleSelectImages}
                        onSelectThumbnail={handleSelectThumbnail}
                     />
                  </Box>
               </>
            )}
            {withDiscount && (
               <>
                  <Box gridArea='discount'>
                     <CurrencyTextField
                        id='discount'
                        name='discount'
                        label='Descuento'
                        value={discount || ''}
                        onChange={handleChangeDiscount}
                        isAllowed={(values) => {
                           const { floatValue } = values
                           return !floatValue || (floatValue > 0 && floatValue <= 100)
                        }}
                        isDiscountInputType
                        required
                     />
                  </Box>
                  <Box gridArea='total-price-with-discount'>
                     <CurrencyTextField
                        id='total-price-with-discount'
                        name='total_price_with_discount'
                        label='Precio con Dto.'
                        value={getPriceWithDiscount(price, discount) || ''}
                        fullWidth
                        disabled
                     />
                  </Box>
               </>
            )}
            {withFormats && (
               <Box gridArea='formats' display='flex' flexDirection='column' rowGap={2}>
                  <Box display='flex' justifyContent='space-between' alignItems='center' width='100%'>
                     <Typography variant='h6' fontWeight='bold'>
                        Formatos
                     </Typography>
                     {!openAddNewFormat ? (
                        <Button
                           onClick={toggleAddNewFormat}
                           variant='contained'
                           color={!openAddNewFormat ? 'primary' : 'secondary'}
                           sx={{ width: 'fit-content' }}
                        >
                           Añadir formato
                        </Button>
                     ) : (
                        <Box display='flex' gap={2}>
                           <Button
                              startIcon={<SaveIcon />}
                              onClick={handleSaveFormat}
                              variant='contained'
                              color='success'
                           >
                              Guardar
                           </Button>
                           <Button
                              startIcon={<CancelIcon />}
                              onClick={toggleAddNewFormat}
                              variant='contained'
                              color='error'
                           >
                              Cancelar
                           </Button>
                        </Box>
                     )}
                  </Box>
                  {openAddNewFormat && <NewFormat onUpdate={handleUpdateNewFormat} />}
                  <Formats
                     formats={formats}
                     onUpdate={handleUpdateFormat}
                     onRemove={handleRemoveFormat}
                     onToggleIsActive={toggleIsActiveFormat}
                  />
               </Box>
            )}
            {withPacks && (
               <Box gridArea='packs' display='flex' flexDirection='column' rowGap={2}>
                  <Box display='flex' justifyContent='space-between' alignItems='center' width='100%'>
                     <Typography variant='h6' fontWeight='bold'>
                        Packs
                     </Typography>
                     {!openAddNewPack ? (
                        <Button
                           onClick={toggleAddNewPack}
                           variant='contained'
                           color={!openAddNewPack ? 'primary' : 'secondary'}
                           sx={{ width: 'fit-content' }}
                        >
                           Añadir pack
                        </Button>
                     ) : (
                        <Box display='flex' gap={2}>
                           <Button
                              startIcon={<SaveIcon />}
                              onClick={handleSavePack}
                              variant='contained'
                              color='success'
                           >
                              Guardar
                           </Button>
                           <Button
                              startIcon={<CancelIcon />}
                              onClick={toggleAddNewPack}
                              variant='contained'
                              color='error'
                           >
                              Cancelar
                           </Button>
                        </Box>
                     )}
                  </Box>
                  {openAddNewPack && (
                     <NewPack
                        price={price}
                        quantity={newPack.quantity || ''}
                        discount={newPack.discount || ''}
                        onChangeDiscount={handleChangeDiscount}
                        onChangeQuantity={handleChangePackQuantity}
                     />
                  )}
                  <Packs
                     price={price}
                     packs={packs}
                     onUpdatePack={handleUpdatePack}
                     onRemovePack={handleRemovePack}
                     onToggleIsActive={handleToggleIsActivePack}
                  />
               </Box>
            )}
            <Box gridArea='description' display='flex' flexDirection='column' marginBottom='15px' rowGap={2}>
               <Typography variant='h6' fontWeight='bold'>
                  Descripción *
               </Typography>
               {/* // TODO: Add question hover button to show Markdown formats */}
               {/* // TODO: "Customize MDEditor styles" */}
               <MDEditor
                  value={description}
                  height='350px'
                  onKeyDown={(event) => {
                     if (event.key === 'Enter') {
                        setDescription((prevDescription) => prevDescription + '\n')
                     }
                  }}
                  components={{
                     textarea: (props) => {
                        const textareaProps = {
                           ...props,
                           style: {
                              ...props.style,
                              fontSize: '15px',
                           },
                        }

                        return <textarea {...textareaProps} />
                     },
                  }}
                  textareaProps={{
                     required: true,
                     name: 'description',
                     placeholder: 'Ingresa la descripción del producto',
                  }}
                  onChange={handleChangeDescription}
                  data-color-mode='light'
               />
            </Box>
            <Box gridArea='reviews' display='flex' flexDirection='column' rowGap={2}>
               <Box>
                  <Typography variant='h6' fontWeight='bold'>
                     Reviews
                  </Typography>
               </Box>
               <Box>
                  <Typography variant='subtitle1' color='rgb(150, 150, 150)'>
                     No hay reviews
                  </Typography>
               </Box>
            </Box>
         </Box>
      </Box>
   )
}

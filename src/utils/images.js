import { supabase } from '../config/supabase-client'

async function uploadFile(file, path = '') {
   const { name, type } = file

   const { error: uploadedImageError, data: uploadedImageData } = await supabase.storage
      .from('images')
      .upload(`${path}/${name}`, file, {
         contentType: type,
         upsert: true,
      })

   if (!uploadedImageError) {
      const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(uploadedImageData.path)
      const { publicUrl: url } = publicUrlData

      return {
         error: null,
         data: { name, url },
      }
   }

   return {
      error: uploadedImageError,
      data: null,
   }
}

export async function uploadImages(path = '', data = [] || {}, defaultMaxImages = 6) {
   let imgGalleryAux = []
   const { data: imgListData } = await supabase.storage.from('images').list(path, {
      limit: 1,
      offset: 0,
   })
   const uploadedImgNames = imgListData.map((img) => img.name)

   if (!Array.isArray(data)) {
      const name = data?.name
      const file = data?.file

      for (const uploadedImgName of uploadedImgNames) {
         const isSameUploadedAndDataImg = uploadedImgName === name

         if (!isSameUploadedAndDataImg) {
            await supabase.storage.from('images').remove(path + '/' + uploadedImgName)
         }
      }

      if (file) {
         const { data: uploadedImgData } = await uploadFile(file, path)
         const newData = uploadedImgData ?? null

         return {
            error: null,
            data: newData,
         }
      }

      return {
         error: null,
         data: null,
      }
   }

   for (const item of data) {
      const { file, ...restOfItemProps } = item

      if (imgListData.length <= defaultMaxImages) {
         const imgGalleryNames = data.map((img) => img.name)

         for (const uploadedImgName of uploadedImgNames) {
            const existsInImgGallery = imgGalleryNames.some((imgGalleryName) => imgGalleryName === uploadedImgName)

            if (!existsInImgGallery) {
               await supabase.storage.from('images').remove(path + '/' + uploadedImgName)
            }
         }

         if (file) {
            const { error: uploadedImgError, data: uploadedImgData } = await uploadFile(file, path)
            const { name, url } = uploadedImgData

            if (uploadedImgError) {
               return {
                  data: null,
                  error: uploadedImgError,
               }
            }

            imgGalleryAux = [...imgGalleryAux, { ...restOfItemProps, name, url }]
         } else {
            imgGalleryAux = [...imgGalleryAux, { ...restOfItemProps }]
         }
      }
   }

   return {
      error: null,
      data: imgGalleryAux,
   }
}

import { isAuthApiError } from '@supabase/supabase-js'
import { useSnackbar } from 'notistack'
import { createContext, useEffect, useState } from 'react'
import { supabase } from '../config/supabase-client'

export const AuthContext = createContext()

export default function AuthProvider({ children }) {
   const [user, setUser] = useState(null)
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      supabase.auth.getSession().then(({ data }) => {
         const { session } = data
         const user = getUserMetadata(session)
         setUser(user)
      })

      const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
         const user = getUserMetadata(session)
         setUser(user)
      })

      setLoading(false)

      return () => {
         listener?.unsubscribe()
      }
   }, [])

   const signUp = async (credentials) => {
      const { email, password, phone, ...restOfCredentials } = credentials
      const { error: signUpError } = await supabase.auth.signUp({
         email,
         password,
         phone,
         options: { data: { email, phone, ...restOfCredentials } },
      })

      if (isAuthApiError(signUpError)) {
         return {
            error: signUpError,
            data: null,
         }
      }

      return {
         error: null,
      }
   }

   const signIn = async (credentials) => {
      const { email, password } = credentials
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

      if (isAuthApiError(signInError)) {
         return {
            error: signInError,
            data: null,
         }
      }

      return {
         error: null,
      }
   }

   const getUserMetadata = (session) => {
      const userMetadata = session?.user.user_metadata ?? null

      if (userMetadata) {
         const { email, phone, options } = userMetadata

         return {
            email,
            phone,
            ...(options && { options }),
         }
      }

      return null
   }

   const value = {
      signUp,
      signIn,
      signOut: () => supabase.auth.signOut(),
      user,
   }

   return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

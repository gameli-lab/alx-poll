'use server'

import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function signUp(formData: FormData) {
  const supabase = createServerClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string

  if (!email || !password || !fullName) {
    return { error: 'Missing required fields' }
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      return { error: error.message }
    }

    if (data.user) {
      revalidatePath('/')
      redirect('/dashboard')
    }
  } catch {
    return { error: 'An unexpected error occurred' }
  }
}

export async function signIn(formData: FormData) {
  const supabase = createServerClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Missing required fields' }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: error.message }
    }

    if (data.user) {
      revalidatePath('/')
      redirect('/dashboard')
    }
  } catch {
    return { error: 'An unexpected error occurred' }
  }
}

export async function signOut() {
  const supabase = createServerClient()
  
  try {
    await supabase.auth.signOut()
    revalidatePath('/')
    redirect('/')
  } catch {
    return { error: 'An unexpected error occurred' }
  }
}

export async function getCurrentUser() {
  const supabase = createServerClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return profile
  } catch {
    return null
  }
}

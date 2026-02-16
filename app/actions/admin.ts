'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

const ADMIN_COOKIE_NAME = 'admin-auth'

export async function adminLogin(formData: FormData) {
  const password = (formData.get('password') ?? '').toString()

  const expected =
    process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length > 0
      ? process.env.ADMIN_PASSWORD
      : 'change-me-admin-password'

  const cookieStore = await cookies()

  if (password !== expected) {
    // Clear any existing cookie on failure, but don't throw
    cookieStore.set(ADMIN_COOKIE_NAME, '', { path: '/admin', maxAge: 0 })
    // Simply revalidate so the login form is shown again
    revalidatePath('/admin')
    return
  }

  cookieStore.set(ADMIN_COOKIE_NAME, '1', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/admin',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  revalidatePath('/admin')
}

export async function adminLogout() {
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE_NAME, '', { path: '/admin', maxAge: 0 })
  revalidatePath('/admin')
}


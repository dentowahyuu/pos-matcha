import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  // Disarankan menggunakan getUser() untuk keamanan ekstra di middleware
  // karena getSession() bisa dimanipulasi di sisi client (browser)
  const { data: { user } } = await supabase.auth.getUser()

  // Tentukan halaman mana saja yang tidak boleh diakses jika belum login
  const isHomePage = request.nextUrl.pathname === '/'
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin')

  if (!user && (isHomePage || isAdminPage)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  // Pastikan '/' ada di sini
  matcher: ['/', '/admin/:path*'],
}
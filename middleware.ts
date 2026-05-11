import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. สร้าง Response เบื้องต้น
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. สร้าง Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // อัปเดตคุกกี้ทั้งใน request และ response
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 3. ✨ สำคัญ: ใช้ getUser() แทน getSession() เพื่อความปลอดภัยและ Refresh Session
  const { data: { user } } = await supabase.auth.getUser()

  const isAddPage = request.nextUrl.pathname.startsWith('/add')
  const isLoginPage = request.nextUrl.pathname.startsWith('/login')

  // 🚪 Logic A: ถ้าไม่มี User และพยายามเข้าหน้า /add -> ดีดไป Login
  if (!user && isAddPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 🏠 Logic B: ถ้า Login แล้วแต่จะไปหน้า /login -> ดีดไปหน้าแรก (Home)
  if (user && isLoginPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
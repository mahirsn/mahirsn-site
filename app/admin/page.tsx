import { cookies } from 'next/headers'
import { getAllLinks } from '@/app/actions/links'
import { adminLogin, adminLogout } from '@/app/actions/admin'
import { LinkAdminClient } from '@/components/link-admin-client'

const ADMIN_COOKIE_NAME = 'admin-auth'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const isAuthed = cookieStore.get(ADMIN_COOKIE_NAME)?.value === '1'

  if (!isAuthed) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6 border border-zinc-800 bg-zinc-950/70 backdrop-blur rounded-xl p-6">
          <h1 className="text-xl font-semibold tracking-tight text-center">
            Admin access
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            Enter the admin password to manage your links.
          </p>
          <form className="space-y-4" action={adminLogin}>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
                placeholder="Admin password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Sign in
            </button>
          </form>
          <p className="text-xs text-muted-foreground text-center">
            You can change the password by setting the{' '}
            <code>ADMIN_PASSWORD</code> environment variable.
          </p>
        </div>
      </main>
    )
  }

  const links = await getAllLinks()

  return (
    <>
      <form action={adminLogout} className="fixed top-4 right-4 z-50">
        <button
          type="submit"
          className="rounded-full border border-zinc-800 bg-zinc-950/80 px-3 py-1.5 text-xs text-muted-foreground hover:bg-zinc-900 hover:text-foreground transition-colors"
        >
          Sign out
        </button>
      </form>
      <LinkAdminClient initialLinks={links} />
    </>
  )
}


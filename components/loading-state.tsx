import { SiteHeader } from "./site-header"

export function LoadingState() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-5 py-20">
        <div className="flex flex-col items-center gap-4">
          <span
            className="h-8 w-8 animate-spin rounded-full border-2 border-card-border border-t-pulse-blue"
            aria-hidden="true"
          />
          <p className="text-sm text-muted">Carregando seu plano...</p>
        </div>
      </main>
    </div>
  )
}

import { SiteHeader } from "./site-header"

export function ErrorState() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-5 py-20">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold text-foreground text-balance">
            Este link não está mais disponível.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Entre em contato com{" "}
            <a href="mailto:suporte@pulsedge.com" className="text-pulse-blue hover:underline">
              suporte@pulsedge.com
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}

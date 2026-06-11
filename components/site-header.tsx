import { Logo } from "./logo"

export function SiteHeader() {
  return (
    <header className="w-full border-b border-card-border">
      <div className="mx-auto flex max-w-3xl items-center px-5 py-5">
        <Logo />
      </div>
    </header>
  )
}

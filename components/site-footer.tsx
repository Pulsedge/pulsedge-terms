export function SiteFooter() {
  return (
    <footer className="mx-auto mt-12 max-w-3xl px-5 pb-10">
      <div className="space-y-2 border-t border-card-border pt-6 text-xs leading-relaxed text-muted">
        <p>Dados coletados de fontes públicas: CETESB, e-Ambiente, Receita Federal.</p>
        <p>Informações de fontes públicas. Não constituem garantia de oportunidade ou resultado.</p>
        <p>{"© 2026 Pulsedge · Vinícius Pereira Barbosa · MEI"}</p>
        <p>
          Dúvidas?{" "}
          <a href="mailto:suporte@pulsedge.com" className="text-pulse-blue hover:underline">
            suporte@pulsedge.com
          </a>
        </p>
      </div>
    </footer>
  )
}

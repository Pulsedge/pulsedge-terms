"use client"

import { useState } from "react"
import { SiteHeader } from "./site-header"
import { SiteFooter } from "./site-footer"
import { PlanCard } from "./plan-card"

export type LeadData = {
  weeklyPlanLinkUrl: string
  dailyPlanLinkUrl: string
}

const PLANS = [
  {
    id: "weekly",
    name: "Pulse Semanal",
    price: "R$ 197/mês",
    badge: "Semanal",
    features: [
      "Entrega toda segunda-feira às 7h",
      "Resumo semanal completo das movimentações",
      "Planilha Excel com dados enriquecidos (CNPJ, contatos, endereço, CNAE)",
      "Monitoramento do portal CETESB-SP",
    ],
  },
  {
    id: "daily",
    name: "Pulse Diário",
    price: "R$ 397/mês",
    badge: "Mais completo",
    highlight: true,
    features: [
      "Tudo do Pulse Semanal",
      "Entregas de terça a sábado às 7h com movimentações do dia anterior",
      "Cobertura diária para não perder nenhuma oportunidade",
    ],
  },
] as const

export function CheckoutPage({ lead }: { lead: LeadData }) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [consent, setConsent] = useState(false)

  const canProceed = selectedPlan !== null && consent

  function handleProceed() {
    if (!canProceed) return
    const url = selectedPlan === "weekly" ? lead.weeklyPlanLinkUrl : lead.dailyPlanLinkUrl
    window.location.href = url
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 md:py-14">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground text-balance md:text-3xl">
            Escolha seu plano
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted md:text-base">
            Inteligência de mercado — chegue antes da concorrência.
          </p>
        </div>

        <div
          role="radiogroup"
          aria-label="Planos disponíveis"
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              id={plan.id}
              name={plan.name}
              price={plan.price}
              badge={plan.badge}
              highlight={"highlight" in plan ? plan.highlight : false}
              features={[...plan.features]}
              selected={selectedPlan === plan.id}
              onSelect={setSelectedPlan}
            />
          ))}
        </div>

        <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-muted">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-pulse-blue"
          />
          <span>
            Eu li e concordo com os{" "}
            <a
              href="https://pulsedge.com.br/termos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pulse-blue hover:underline"
            >
              Termos de Serviço
            </a>{" "}
            e a{" "}
            <a
              href="https://pulsedge.com.br/privacidade"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pulse-blue hover:underline"
            >
              Política de Privacidade
            </a>{" "}
            da Pulsedge.
          </span>
        </label>

        <div className="mt-6 flex flex-col items-center">
          <button
            type="button"
            onClick={handleProceed}
            disabled={!canProceed}
            className={`w-full rounded-lg px-6 py-3.5 text-sm font-semibold transition-colors md:w-auto md:min-w-72 ${
              canProceed
                ? "cursor-pointer bg-pulse-blue text-white hover:bg-pulse-blue/90"
                : "cursor-not-allowed bg-card-border text-muted"
            }`}
          >
            Prosseguir para pagamento →
          </button>
          <p className="mt-3 text-center text-xs text-muted">
            Você será redirecionado para o ambiente seguro de pagamento do Asaas.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

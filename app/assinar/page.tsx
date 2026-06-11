"use client"

import { useEffect, useState } from "react"
import { CheckoutPage, type LeadData } from "@/components/checkout-page"
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"

// Dados simulados — em produção viriam da validação do LEAD_ID (?h=)
const MOCK_LEAD: LeadData = {
  weeklyPlanLinkUrl: "#",
  dailyPlanLinkUrl: "#",
}

// Alterne para simular os diferentes estados da página:
// "ready"   -> exibe os cards de checkout
// "loading" -> exibe o spinner
// "error"   -> exibe a mensagem de link inválido
const SIMULATED_STATE: "ready" | "loading" | "error" = "ready"

export default function AssinarPage() {
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading")

  useEffect(() => {
    // Simula a busca/validação do lead
    const timer = setTimeout(() => {
      setStatus(SIMULATED_STATE === "loading" ? "loading" : SIMULATED_STATE)
    }, SIMULATED_STATE === "loading" ? 1000000 : 600)
    return () => clearTimeout(timer)
  }, [])

  if (status === "loading") return <LoadingState />
  if (status === "error") return <ErrorState />
  return <CheckoutPage lead={MOCK_LEAD} />
}

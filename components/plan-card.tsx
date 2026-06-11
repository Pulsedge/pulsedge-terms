type PlanCardProps = {
  id: string
  name: string
  price: string
  badge: string
  highlight?: boolean
  features: string[]
  selected: boolean
  onSelect: (id: string) => void
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 shrink-0 text-pulse-blue"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export function PlanCard({
  id,
  name,
  price,
  badge,
  highlight,
  features,
  selected,
  onSelect,
}: PlanCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(id)}
      className={`relative flex w-full flex-col rounded-lg border p-5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pulse-blue ${
        selected
          ? "border-pulse-blue bg-pulse-blue/10"
          : "border-card-border bg-transparent hover:border-muted/50"
      }`}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
            highlight
              ? "bg-pulse-blue text-white"
              : "bg-card-border text-muted"
          }`}
        >
          {badge}
        </span>
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full border ${
            selected ? "border-pulse-blue bg-pulse-blue" : "border-muted/50"
          }`}
          aria-hidden="true"
        >
          {selected && <span className="h-2 w-2 rounded-full bg-white" />}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-foreground">{name}</h3>
      <p className="mt-1 mb-5">
        <span className="text-2xl font-bold text-foreground">{price.split("/")[0]}</span>
        <span className="text-sm text-muted">/{price.split("/")[1]}</span>
      </p>

      <ul className="space-y-2.5">
        {features.map((feature) => (
          <li key={feature} className="flex gap-2 text-sm leading-relaxed text-muted">
            <CheckIcon />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </button>
  )
}

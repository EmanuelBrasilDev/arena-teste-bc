import { Dices } from "lucide-react"

import type { DiceRollResult } from "@/types/arena"

type DiceResultCardProps = {
  roll: DiceRollResult
}

export function DiceResultCard({
  roll,
}: DiceResultCardProps) {
  return (
    <div className="mt-4 border-l-2 border-violet-500/60 pl-4">

      <div className="flex flex-wrap items-center justify-between gap-3">

        <div className="flex items-center gap-2">
          <Dices className="size-4 text-violet-400" />

          <span className="font-mono text-sm font-semibold text-white">
            {roll.expression}
          </span>

          <span className="text-[10px] uppercase tracking-[0.15em] text-zinc-600">
            D{roll.sides}
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
            Total
          </span>

          <span className="font-mono text-2xl font-bold text-violet-300">
            {roll.total}
          </span>
        </div>

      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {roll.rolls.map((value, index) => (
          <span
            key={`${roll.id}-${index}`}
            className="font-mono text-sm text-zinc-300"
          >
            {value}
            {index < roll.rolls.length - 1 && (
              <span className="ml-2 text-zinc-700">
                +
              </span>
            )}
          </span>
        ))}

        {roll.modifier !== 0 && (
          <>
            <span className="text-zinc-700">
              {roll.modifier > 0 ? "+" : "−"}
            </span>

            <span className="font-mono text-sm text-zinc-300">
              {Math.abs(roll.modifier)}
            </span>
          </>
        )}
      </div>

    </div>
  )
}

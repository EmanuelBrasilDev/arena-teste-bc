import {
  Dices,
  ShieldCheck,
  ShieldHalf,
  Skull,
  Swords,
} from "lucide-react"

import {
  useState,
} from "react"

import {
  rollDiceExpression,
} from "@/engine/dice/roller"

import {
  useArenaStore,
} from "@/stores/arena-store"

import type {
  IntegralResistanceResult,
  PartialResistanceResult,
} from "@/types/substatus"

function clampPercentage(
  value: number,
) {
  return Math.min(
    100,
    Math.max(
      0,
      value,
    ),
  )
}

function parsePercentage(
  value: string,
) {
  const number =
    Number(value)

  if (
    !Number.isFinite(
      number,
    )
  ) {
    return 0
  }

  return clampPercentage(
    number,
  )
}

export function SubstatusTestLab() {
  const [
    debuffChance,
    setDebuffChance,
  ] =
    useState("80")

  const [
    partialResistance,
    setPartialResistance,
  ] =
    useState("30")

  const [
    attackerExpression,
    setAttackerExpression,
  ] =
    useState(
      "1d20+20",
    )

  const [
    defenderExpression,
    setDefenderExpression,
  ] =
    useState(
      "1d20+15",
    )

  const [
    partialResult,
    setPartialResult,
  ] =
    useState<PartialResistanceResult | null>(
      null,
    )

  const [
    integralResult,
    setIntegralResult,
  ] =
    useState<IntegralResistanceResult | null>(
      null,
    )

  const enqueueRollAnimation =
    useArenaStore(
      (state) =>
        state.enqueueRollAnimation,
    )

  function testPartial() {
    const debuff =
      parsePercentage(
        debuffChance,
      )

    const resistance =
      parsePercentage(
        partialResistance,
      )

    /*
     * Regra definida:
     *
     * 80% - 30% = 50%
     */
    const finalChance =
      clampPercentage(
        debuff -
          resistance,
      )

    const roll =
      rollDiceExpression(
        "d100",
      )

    enqueueRollAnimation(
      roll,
    )

    setPartialResult({
      debuffChance:
        debuff,

      resistance,

      finalChance,

      roll:
        roll.total,

      /*
       * Rolagem alta favorece quem aplica o Debuff.
       *
       * Exemplo:
       * chance final = 50%
       * FAILED  = 1–50
       * SUCCESS = 51–100
       *
       * A quantidade de resultados vencedores
       * continua exatamente igual à porcentagem final.
       */
      success:
        roll.total >
        100 - finalChance,
    })
  }

  function testIntegral() {
    try {
      const attacker =
        rollDiceExpression(
          attackerExpression,
        )

      const defender =
        rollDiceExpression(
          defenderExpression,
        )

      /*
       * Reutilizamos exatamente
       * a animação global da Arena.
       *
       * A fila exibirá primeiro
       * uma rolagem e depois a outra.
       */
      enqueueRollAnimation(
        attacker,
      )

      enqueueRollAnimation(
        defender,
      )

      let winner:
        IntegralResistanceResult["winner"] =
        "draw"

      if (
        attacker.total >
        defender.total
      ) {
        winner =
          "attacker"
      }

      if (
        defender.total >
        attacker.total
      ) {
        winner =
          "defender"
      }

      setIntegralResult({
        attackerExpression,

        defenderExpression,

        attackerTotal:
          attacker.total,

        defenderTotal:
          defender.total,

        winner,
      })
    } catch (error) {
      console.error(
        error,
      )

      window.alert(
        "Uma das expressões de dado é inválida.",
      )
    }
  }

  const partialFinal =
    clampPercentage(
      parsePercentage(
        debuffChance,
      ) -
        parsePercentage(
          partialResistance,
        ),
    )

  return (
    <section>
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <Dices className="size-5 text-violet-400" />

          <h2 className="text-lg font-semibold text-white">
            Testes de Substatus
          </h2>
        </div>

        <p className="mt-2 text-sm text-zinc-500">
          Área experimental para verificar Debuffs e resistências.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">

        {/* DEBUFF */}

        <div className="rounded-2xl border border-red-400/15 bg-[linear-gradient(145deg,rgba(69,10,10,0.30),rgba(15,10,18,0.92))] p-5">
          <div className="mb-4 flex items-center gap-2 text-red-200">
            <Skull className="size-4" />

            <div className="text-sm font-bold">
              Debuff
            </div>
          </div>

          <label className="block">
            <div className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
              Chance de sucesso
            </div>

            <div className="flex items-center rounded-xl border border-red-400/10 bg-black/20">
              <input
                type="number"
                min="0"
                max="100"
                value={
                  debuffChance
                }
                onChange={(
                  event,
                ) =>
                  setDebuffChance(
                    event
                      .target
                      .value,
                  )
                }
                className="h-11 min-w-0 flex-1 bg-transparent px-3 font-mono text-white outline-none"
              />

              <span className="pr-3 text-sm text-red-300">
                %
              </span>
            </div>
          </label>
        </div>

        {/* PARCIAL */}

        <div className="rounded-2xl border border-amber-400/15 bg-[linear-gradient(145deg,rgba(69,26,3,0.28),rgba(15,12,9,0.92))] p-5">
          <div className="mb-4 flex items-center gap-2 text-amber-200">
            <ShieldHalf className="size-4" />

            <div className="text-sm font-bold">
              Resistência Parcial
            </div>
          </div>

          <label className="block">
            <div className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
              Resistência
            </div>

            <div className="flex items-center rounded-xl border border-amber-400/10 bg-black/20">
              <input
                type="number"
                min="0"
                max="100"
                value={
                  partialResistance
                }
                onChange={(
                  event,
                ) =>
                  setPartialResistance(
                    event
                      .target
                      .value,
                  )
                }
                className="h-11 min-w-0 flex-1 bg-transparent px-3 font-mono text-white outline-none"
              />

              <span className="pr-3 text-sm text-amber-300">
                %
              </span>
            </div>
          </label>

          <div className="mt-4 rounded-xl border border-white/[0.06] bg-black/20 p-3">
            <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-600">
              Chance final
            </div>

            <div className="mt-1 font-mono text-2xl font-black text-white">
              {
                partialFinal
              }
              %
            </div>
          </div>

          <button
            type="button"
            onClick={
              testPartial
            }
            className="mt-4 h-10 w-full rounded-xl bg-amber-500 text-sm font-bold text-black transition hover:bg-amber-400"
          >
            Testar efeito
          </button>
        </div>

        {/* INTEGRAL */}

        <div className="rounded-2xl border border-cyan-400/15 bg-[linear-gradient(145deg,rgba(8,47,73,0.30),rgba(8,12,20,0.94))] p-5">
          <div className="mb-4 flex items-center gap-2 text-cyan-200">
            <ShieldCheck className="size-4" />

            <div className="text-sm font-bold">
              Resistência Integral
            </div>
          </div>

          <div className="space-y-3">

            <label className="block">
              <div className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
                Debuff / Ataque
              </div>

              <input
                value={
                  attackerExpression
                }
                onChange={(
                  event,
                ) =>
                  setAttackerExpression(
                    event
                      .target
                      .value,
                  )
                }
                className="h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 font-mono text-sm text-white outline-none focus:border-violet-500/40"
              />
            </label>

            <div className="text-center text-xs font-black text-zinc-600">
              VS
            </div>

            <label className="block">
              <div className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
                Resistência
              </div>

              <input
                value={
                  defenderExpression
                }
                onChange={(
                  event,
                ) =>
                  setDefenderExpression(
                    event
                      .target
                      .value,
                  )
                }
                className="h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 font-mono text-sm text-white outline-none focus:border-cyan-500/40"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={
              testIntegral
            }
            className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 text-sm font-bold text-slate-950 transition hover:bg-cyan-400"
          >
            <Swords className="size-4" />
            Confrontar
          </button>
        </div>
      </div>

      {/* RESULTADO PARCIAL */}

      {partialResult && (
        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c13]">

          <div className="grid gap-px bg-white/[0.06] md:grid-cols-4">

            <div className="bg-[#0c0c13] p-4">
              <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                Debuff
              </div>

              <div className="mt-1 font-mono text-xl font-black text-red-200">
                {
                  partialResult
                    .debuffChance
                }
                %
              </div>
            </div>

            <div className="bg-[#0c0c13] p-4">
              <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                Resistência
              </div>

              <div className="mt-1 font-mono text-xl font-black text-amber-200">
                {
                  partialResult
                    .resistance
                }
                %
              </div>
            </div>

            <div className="bg-[#0c0c13] p-4">
              <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                Final
              </div>

              <div className="mt-1 font-mono text-xl font-black text-white">
                {
                  partialResult
                    .finalChance
                }
                %
              </div>
            </div>

            <div className="bg-[#0c0c13] p-4">
              <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                D100
              </div>

              <div className="mt-1 font-mono text-xl font-black text-violet-200">
                {
                  partialResult
                    .roll
                }
              </div>
            </div>
          </div>

          <div
            className={[
              "border-t px-5 py-4 text-center",
              partialResult
                .success
                ? "border-emerald-400/15 bg-emerald-500/[0.055]"
                : "border-red-400/15 bg-red-500/[0.055]",
            ].join(" ")}
          >
            <div
              className={[
                "text-2xl font-black tracking-[0.16em]",
                partialResult
                  .success
                  ? "text-emerald-300"
                  : "text-red-300",
              ].join(" ")}
            >
              {partialResult
                .success
                ? "SUCCESS"
                : "FAILED"}
            </div>

            <div className="mt-1 text-xs text-zinc-500">
              Rolagem:{" "}
              {
                partialResult.roll
              }
              {" • "}
              SUCCESS:{" "}
              {partialResult.finalChance > 0
                ? `${101 - partialResult.finalChance}–100`
                : "nenhuma faixa"}
            </div>
          </div>
        </div>
      )}

      {/* RESULTADO INTEGRAL */}

      {integralResult && (
        <div className="mt-5 rounded-2xl border border-white/10 bg-[#0c0c13] p-5">

          <div className="mb-4 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-600">
            Resultado do confronto
          </div>

          <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">

            <div
              className={[
                "rounded-xl border p-5 text-center",
                integralResult
                  .winner ===
                  "attacker"
                  ? "border-red-400/25 bg-red-500/[0.07]"
                  : "border-white/8 bg-white/[0.025]",
              ].join(" ")}
            >
              <div className="font-mono text-sm text-zinc-500">
                {
                  integralResult
                    .attackerExpression
                }
              </div>

              <div className="mt-2 font-mono text-4xl font-black text-white">
                {
                  integralResult
                    .attackerTotal
                }
              </div>

              <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">
                Debuff
              </div>
            </div>

            <div className="text-center text-xl font-black text-zinc-700">
              VS
            </div>

            <div
              className={[
                "rounded-xl border p-5 text-center",
                integralResult
                  .winner ===
                  "defender"
                  ? "border-cyan-400/25 bg-cyan-500/[0.07]"
                  : "border-white/8 bg-white/[0.025]",
              ].join(" ")}
            >
              <div className="font-mono text-sm text-zinc-500">
                {
                  integralResult
                    .defenderExpression
                }
              </div>

              <div className="mt-2 font-mono text-4xl font-black text-white">
                {
                  integralResult
                    .defenderTotal
                }
              </div>

              <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                Resistência
              </div>
            </div>
          </div>

          <div className="mt-5 text-center">

            {integralResult
              .winner ===
              "attacker" && (
              <>
                <div className="text-2xl font-black tracking-[0.16em] text-red-300">
                  SUCCESS
                </div>

                <div className="mt-1 text-xs text-zinc-500">
                  O Debuff venceu a Resistência Integral.
                </div>
              </>
            )}

            {integralResult
              .winner ===
              "defender" && (
              <>
                <div className="text-2xl font-black tracking-[0.16em] text-cyan-300">
                  FAILED
                </div>

                <div className="mt-1 text-xs text-zinc-500">
                  A Resistência Integral venceu o Debuff.
                </div>
              </>
            )}

            {integralResult
              .winner ===
              "draw" && (
              <>
                <div className="text-2xl font-black tracking-[0.16em] text-amber-300">
                  DRAW
                </div>

                <div className="mt-1 text-xs text-zinc-500">
                  As duas rolagens tiveram o mesmo resultado.
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

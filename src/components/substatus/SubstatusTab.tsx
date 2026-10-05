import {
  Plus,
  Sparkles,
} from "lucide-react"

import {
  SubstatusCharacterCard,
} from "@/components/substatus/SubstatusCharacterCard"

import {
  SubstatusTestLab,
} from "@/components/substatus/SubstatusTestLab"

import {
  useSubstatusStore,
} from "@/stores/substatus-store"

export function SubstatusTab() {
  const sheets =
    useSubstatusStore(
      (state) =>
        state.sheets,
    )

  const addCharacter =
    useSubstatusStore(
      (state) =>
        state.addCharacter,
    )

  return (
    <div className="min-h-[650px]">

      {/* LABORATÓRIO */}

      <SubstatusTestLab />

      {/* DIVISOR */}

      <div className="my-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* STATUS ATIVOS */}

      <section>
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">

          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-violet-400" />

              <h2 className="text-lg font-semibold text-white">
                Substatus Ativos
              </h2>
            </div>

            <p className="mt-2 text-sm text-zinc-500">
              Controle manual de Buffs, Debuffs, quantidade e duração.
            </p>
          </div>

          <button
            type="button"
            onClick={
              addCharacter
            }
            className="flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white transition hover:bg-violet-500"
          >
            <Plus className="size-4" />
            Personagem
          </button>
        </div>

        {sheets.length >
          0 ? (
          <div className="grid items-start gap-5 xl:grid-cols-2">

            {sheets.map(
              (sheet) => (
                <SubstatusCharacterCard
                  key={
                    sheet.id
                  }
                  sheet={
                    sheet
                  }
                />
              ),
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center text-sm text-zinc-600">
            Nenhum personagem possui Substatus.
          </div>
        )}
      </section>

      <div className="mt-10 border-t border-white/[0.06] pt-4 text-[10px] uppercase tracking-[0.17em] text-zinc-700">
        Substatus e durações são controlados manualmente
      </div>
    </div>
  )
}

import {
  Plus,
  Trash2,
  Users,
} from "lucide-react"

import {
  CharacterSheetCard,
} from "@/components/data/CharacterSheetCard"

import {
  useDataStore,
} from "@/stores/data-store"

import type {
  DataDivision,
} from "@/types/data"

type DataDivisionSectionProps = {
  division: DataDivision
}

export function DataDivisionSection({
  division,
}: DataDivisionSectionProps) {
  const renameDivision =
    useDataStore(
      (state) =>
        state.renameDivision,
    )

  const removeDivision =
    useDataStore(
      (state) =>
        state.removeDivision,
    )

  const addSheet =
    useDataStore(
      (state) =>
        state.addSheet,
    )

  function askRemoveDivision() {
    const confirmed =
      window.confirm(
        `Excluir a divisão "${division.name}" e todas as fichas dela?`,
      )

    if (!confirmed) {
      return
    }

    removeDivision(
      division.id,
    )
  }

  return (
    <section className="border-t border-white/10 pt-6 first:border-t-0 first:pt-0">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-300">
            <Users className="size-4" />
          </div>

          <div className="min-w-0">
            <input
              value={
                division.name
              }
              onChange={(
                event,
              ) =>
                renameDivision(
                  division.id,
                  event.target
                    .value,
                )
              }
              className="w-full min-w-0 bg-transparent text-lg font-bold text-white outline-none placeholder:text-zinc-700"
              placeholder="Nome da divisão"
            />

            <div className="mt-0.5 text-xs text-zinc-600">
              {division.sheets.length}{" "}
              {division.sheets.length ===
              1
                ? "ficha"
                : "fichas"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              addSheet(
                division.id,
              )
            }
            className="flex h-9 items-center gap-2 rounded-lg border border-violet-500/20 bg-violet-500/10 px-3 text-xs font-semibold text-violet-200 transition hover:border-violet-400/40 hover:bg-violet-500/15 hover:text-white"
          >
            <Plus className="size-4" />
            Nova ficha
          </button>

          <button
            type="button"
            onClick={
              askRemoveDivision
            }
            title="Excluir divisão"
            className="flex size-9 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      {division.sheets.length >
      0 ? (
        <div className="grid items-start gap-5 2xl:grid-cols-2">
          {division.sheets.map(
            (sheet) => (
              <CharacterSheetCard
                key={
                  sheet.id
                }
                divisionId={
                  division.id
                }
                sheet={
                  sheet
                }
              />
            ),
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() =>
            addSheet(
              division.id,
            )
          }
          className="flex min-h-32 w-full items-center justify-center rounded-2xl border border-dashed border-white/10 text-sm text-zinc-600 transition hover:border-violet-500/25 hover:bg-violet-500/[0.03] hover:text-zinc-400"
        >
          + Adicionar primeira ficha nesta divisão
        </button>
      )}
    </section>
  )
}

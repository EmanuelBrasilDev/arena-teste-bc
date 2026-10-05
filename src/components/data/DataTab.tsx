import {
  FolderPlus,
  Layers3,
} from "lucide-react"

import {
  DataDivisionSection,
} from "@/components/data/DataDivisionSection"

import {
  useDataStore,
} from "@/stores/data-store"

export function DataTab() {
  const divisions =
    useDataStore(
      (state) =>
        state.divisions,
    )

  const addDivision =
    useDataStore(
      (state) =>
        state.addDivision,
    )

  function createDivision() {
    const value =
      window.prompt(
        "Nome da nova divisão:",
        "Nova Divisão",
      )

    if (!value) {
      return
    }

    addDivision(value)
  }

  return (
    <div className="min-h-[650px]">
      <div className="mb-7 flex flex-wrap items-start justify-between gap-5 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Layers3 className="size-5 text-violet-400" />

            <h2 className="text-lg font-semibold text-white">
              Dados
            </h2>
          </div>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
            Organize personagens em divisões e monte fichas livres com VTD, PV, PM, atributos, itens, habilidades, grimórios e qualquer informação necessária.
          </p>
        </div>

        <button
          type="button"
          onClick={
            createDivision
          }
          className="flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white transition hover:bg-violet-500 active:scale-[0.98]"
        >
          <FolderPlus className="size-4" />
          Criar divisão
        </button>
      </div>

      {divisions.length >
      0 ? (
        <div className="space-y-10">
          {divisions.map(
            (division) => (
              <DataDivisionSection
                key={
                  division.id
                }
                division={
                  division
                }
              />
            ),
          )}
        </div>
      ) : (
        <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 text-center">
          <Layers3 className="mb-4 size-8 text-zinc-700" />

          <div className="font-semibold text-white">
            Nenhuma divisão criada
          </div>

          <div className="mt-2 max-w-sm text-sm leading-6 text-zinc-600">
            Você pode criar grupos como Inimigos, Aliados, Elfos, Touros Negros, Águias Prateadas ou qualquer outra organização.
          </div>

          <button
            type="button"
            onClick={
              createDivision
            }
            className="mt-5 rounded-xl border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/15 hover:text-white"
          >
            Criar primeira divisão
          </button>
        </div>
      )}

      <div className="mt-10 border-t border-white/8 pt-4 text-[10px] uppercase tracking-[0.17em] text-zinc-700">
        Salvamento local automático • Nenhum banco de dados conectado
      </div>
    </div>
  )
}

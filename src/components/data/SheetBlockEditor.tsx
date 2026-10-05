import {
  ChevronDown,
  ChevronUp,
  Trash2,
} from "lucide-react"

import {
  useDataStore,
} from "@/stores/data-store"

import type {
  SheetBlock,
  SheetBlockType,
} from "@/types/data"

type SheetBlockEditorProps = {
  divisionId: string
  sheetId: string
  block: SheetBlock

  isFirst: boolean
  isLast: boolean
}

const labels:
  Record<
    SheetBlockType,
    string
  > = {
    heading: "Título",
    field: "Campo",
    entry: "Opção",
  }

export function SheetBlockEditor({
  divisionId,
  sheetId,
  block,
  isFirst,
  isLast,
}: SheetBlockEditorProps) {
  const updateBlock =
    useDataStore(
      (state) =>
        state.updateBlock,
    )

  const removeBlock =
    useDataStore(
      (state) =>
        state.removeBlock,
    )

  const moveBlock =
    useDataStore(
      (state) =>
        state.moveBlock,
    )

  return (
    <div className="rounded-xl border border-white/8 bg-black/20 p-3">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="rounded-md border border-violet-500/20 bg-violet-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-violet-300">
          {labels[block.type]}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={
              isFirst
            }
            onClick={() =>
              moveBlock(
                divisionId,
                sheetId,
                block.id,
                "up",
              )
            }
            className="flex size-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/5 hover:text-white disabled:pointer-events-none disabled:opacity-20"
          >
            <ChevronUp className="size-4" />
          </button>

          <button
            type="button"
            disabled={
              isLast
            }
            onClick={() =>
              moveBlock(
                divisionId,
                sheetId,
                block.id,
                "down",
              )
            }
            className="flex size-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/5 hover:text-white disabled:pointer-events-none disabled:opacity-20"
          >
            <ChevronDown className="size-4" />
          </button>

          <button
            type="button"
            onClick={() =>
              removeBlock(
                divisionId,
                sheetId,
                block.id,
              )
            }
            className="flex size-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <input
          value={
            block.title
          }
          onChange={(
            event,
          ) =>
            updateBlock(
              divisionId,
              sheetId,
              block.id,
              {
                title:
                  event.target
                    .value,
              },
            )
          }
          placeholder={
            block.type ===
            "heading"
              ? "Título da seção"
              : block.type ===
                  "field"
                ? "Nome do campo"
                : "Nome da opção"
          }
          className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.025] px-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-violet-500/50"
        />

        {block.type ===
          "field" && (
          <input
            value={
              block.value
            }
            onChange={(
              event,
            ) =>
              updateBlock(
                divisionId,
                sheetId,
                block.id,
                {
                  value:
                    event.target
                      .value,
                },
              )
            }
            placeholder="Valor"
            className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.025] px-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-violet-500/50"
          />
        )}

        {block.type ===
          "entry" && (
          <textarea
            value={
              block.details
            }
            onChange={(
              event,
            ) =>
              updateBlock(
                divisionId,
                sheetId,
                block.id,
                {
                  details:
                    event.target
                      .value,
                },
              )
            }
            placeholder={
              "Uma informação por linha.\nEx: Dano adicional: +1d5."
            }
            rows={3}
            className="arena-scrollbar min-h-24 w-full resize-y rounded-lg border border-white/10 bg-white/[0.025] px-3 py-2 text-sm leading-5 text-white outline-none placeholder:text-zinc-700 focus:border-violet-500/50"
          />
        )}
      </div>
    </div>
  )
}

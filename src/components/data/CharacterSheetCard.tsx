import {
  Check,
  Copy,
  Heart,
  Image as ImageIcon,
  Link2,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  WandSparkles,
} from "lucide-react"

import {
  useEffect,
  useState,
} from "react"

import {
  ExpandableSheetFrame,
} from "@/components/data/ExpandableSheetFrame"

import {
  SheetBlockEditor,
} from "@/components/data/SheetBlockEditor"

import {
  SheetBlockView,
} from "@/components/data/SheetBlockView"

import {
  useDataStore,
} from "@/stores/data-store"

import type {
  CharacterSheet,
  SheetBlockType,
} from "@/types/data"

type CharacterSheetCardProps = {
  divisionId: string
  sheet: CharacterSheet
}

function isValidRemoteImageUrl(
  value: string,
) {
  const clean =
    value.trim()

  if (!clean) {
    return false
  }

  try {
    const url =
      new URL(clean)

    return (
      url.protocol ===
        "http:" ||
      url.protocol ===
        "https:"
    )
  } catch {
    return false
  }
}

function getInitials(
  name: string,
) {
  const parts =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)

  if (
    parts.length ===
    0
  ) {
    return "?"
  }

  if (
    parts.length ===
    1
  ) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase()
  }

  return (
    parts[0][0] +
    parts[
      parts.length - 1
    ][0]
  ).toUpperCase()
}

export function CharacterSheetCard({
  divisionId,
  sheet,
}: CharacterSheetCardProps) {
  const [
    editing,
    setEditing,
  ] =
    useState(false)

  const [
    imageFailed,
    setImageFailed,
  ] =
    useState(false)

  const updateBaseField =
    useDataStore(
      (state) =>
        state.updateBaseField,
    )

  const addBlock =
    useDataStore(
      (state) =>
        state.addBlock,
    )

  const duplicateSheet =
    useDataStore(
      (state) =>
        state.duplicateSheet,
    )

  const removeSheet =
    useDataStore(
      (state) =>
        state.removeSheet,
    )

  const imageUrl =
    sheet.imageUrl?.trim() ??
    ""

  const validImageUrl =
    isValidRemoteImageUrl(
      imageUrl,
    )

  const showImage =
    validImageUrl &&
    !imageFailed

  useEffect(() => {
    setImageFailed(false)
  }, [imageUrl])

  function createOption(
    type: SheetBlockType,
  ) {
    addBlock(
      divisionId,
      sheet.id,
      type,
    )

    if (!editing) {
      setEditing(true)
    }
  }

  function askRemove() {
    const confirmed =
      window.confirm(
        `Excluir a ficha de "${sheet.name}"?`,
      )

    if (!confirmed) {
      return
    }

    removeSheet(
      divisionId,
      sheet.id,
    )
  }

  return (
    <ExpandableSheetFrame>
      <div className="p-5 sm:p-6">

        {/* =================================================
            HEADER
            ================================================= */}

        <div className="flex flex-col gap-5 border-b border-white/[0.07] pb-5 sm:flex-row sm:items-start">

          {/* RETRATO */}

          <div className="shrink-0">
            <div className="relative size-[92px] overflow-hidden rounded-[18px] border border-violet-300/25 bg-[#100d1f] shadow-[0_0_40px_-14px_rgba(139,92,246,0.95)]">
              {showImage ? (
                <img
                  src={imageUrl}
                  alt={`Retrato de ${sheet.name}`}
                  onError={() =>
                    setImageFailed(
                      true,
                    )
                  }
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.28),transparent_68%),linear-gradient(180deg,#1a1431_0%,#0f1020_100%)]">
                  <span className="text-xl font-black tracking-tight text-violet-200">
                    {getInitials(
                      sheet.name,
                    )}
                  </span>
                </div>
              )}

              <div className="pointer-events-none absolute inset-0 rounded-[18px] ring-1 ring-inset ring-white/[0.05]" />

              <div className="pointer-events-none absolute inset-x-2 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-200/80 to-transparent" />
            </div>
          </div>

          {/* IDENTIDADE */}

          <div className="min-w-0 flex-1">

            <div className="flex flex-wrap items-start justify-between gap-4">

              <div className="min-w-0 flex-1">

                {editing ? (
                  <input
                    value={
                      sheet.name
                    }
                    onChange={(
                      event,
                    ) =>
                      updateBaseField(
                        divisionId,
                        sheet.id,
                        "name",
                        event.target
                          .value,
                      )
                    }
                    placeholder="Nome do personagem"
                    className="h-10 w-full border-b border-violet-500/30 bg-transparent text-xl font-bold tracking-tight text-white outline-none focus:border-violet-400"
                  />
                ) : (
                  <div className="flex flex-wrap items-center gap-2.5">

                    <h3 className="break-words text-xl font-black tracking-tight text-white sm:text-2xl">
                      {sheet.name ||
                        "Sem Nome"}
                    </h3>

                    <div
                      title="Vontade Acumulada em Batalha"
                      className="flex items-center gap-1.5 rounded-full border border-violet-300/20 bg-violet-500/18 px-2.5 py-1 shadow-[0_0_16px_-8px_rgba(139,92,246,1)]"
                    >
                      <Sparkles className="size-3 text-violet-300" />

                      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-violet-100">
                        VTD
                      </span>

                      <span className="font-mono text-xs font-bold text-violet-50">
                        {sheet.vtd ||
                          "0"}
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                  Ficha de batalha
                </div>
              </div>

              {/* AÇÕES */}

              <div className="flex shrink-0 items-center gap-1">

                <button
                  type="button"
                  onClick={() =>
                    duplicateSheet(
                      divisionId,
                      sheet.id,
                    )
                  }
                  title="Duplicar ficha"
                  className="flex size-9 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-white/5 hover:text-white"
                >
                  <Copy className="size-4" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setEditing(
                      (value) =>
                        !value,
                    )
                  }
                  className={[
                    "flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-semibold transition",
                    editing
                      ? "bg-violet-600 text-white shadow-[0_0_20px_-10px_rgba(139,92,246,0.9)] hover:bg-violet-500"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white",
                  ].join(" ")}
                >
                  {editing ? (
                    <>
                      <Check className="size-4" />
                      Concluir
                    </>
                  ) : (
                    <>
                      <Pencil className="size-4" />
                      Editar
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={
                    askRemove
                  }
                  title="Excluir ficha"
                  className="flex size-9 items-center justify-center rounded-lg text-zinc-700 transition hover:bg-red-500/10 hover:text-red-300"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>

            {/* =============================================
                STATS
                ============================================= */}

            {editing ? (
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <label className="space-y-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                    VTD
                  </span>

                  <input
                    value={
                      sheet.vtd
                    }
                    onChange={(
                      event,
                    ) =>
                      updateBaseField(
                        divisionId,
                        sheet.id,
                        "vtd",
                        event.target
                          .value,
                      )
                    }
                    className="h-10 w-full rounded-lg border border-violet-500/15 bg-black/25 px-3 font-mono text-sm font-semibold text-white outline-none focus:border-violet-500/50"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                    PV
                  </span>

                  <input
                    value={
                      sheet.pv
                    }
                    onChange={(
                      event,
                    ) =>
                      updateBaseField(
                        divisionId,
                        sheet.id,
                        "pv",
                        event.target
                          .value,
                      )
                    }
                    className="h-10 w-full rounded-lg border border-red-500/15 bg-black/25 px-3 font-mono text-sm font-semibold text-white outline-none focus:border-red-500/50"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                    PM
                  </span>

                  <input
                    value={
                      sheet.pm
                    }
                    onChange={(
                      event,
                    ) =>
                      updateBaseField(
                        divisionId,
                        sheet.id,
                        "pm",
                        event.target
                          .value,
                      )
                    }
                    className="h-10 w-full rounded-lg border border-cyan-500/15 bg-black/25 px-3 font-mono text-sm font-semibold text-white outline-none focus:border-cyan-500/50"
                  />
                </label>
              </div>
            ) : (
              <div className="mt-5 grid grid-cols-2 gap-3">

                <div className="relative overflow-hidden rounded-xl border border-red-400/20 bg-[linear-gradient(180deg,rgba(127,29,29,0.34),rgba(69,10,10,0.22))] px-4 py-3 shadow-[0_18px_35px_-26px_rgba(248,113,113,0.85)]">
                  <div className="absolute inset-y-3 left-0 w-[2px] bg-red-300/90" />

                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-red-200/85">
                    <Heart className="size-3" />
                    PV
                  </div>

                  <div className="mt-1 font-mono text-xl font-black text-white">
                    {sheet.pv ||
                      "0"}
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-xl border border-cyan-400/20 bg-[linear-gradient(180deg,rgba(8,47,73,0.34),rgba(8,145,178,0.14))] px-4 py-3 shadow-[0_18px_35px_-26px_rgba(34,211,238,0.85)]">
                  <div className="absolute inset-y-3 left-0 w-[2px] bg-cyan-300/90" />

                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-200/90">
                    <WandSparkles className="size-3" />
                    PM
                  </div>

                  <div className="mt-1 font-mono text-xl font-black text-white">
                    {sheet.pm ||
                      "0"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =================================================
            URL DA IMAGEM
            ================================================= */}

        {editing && (
          <div className="mt-5 rounded-xl border border-violet-400/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(124,58,237,0.04))] p-4">
            <div className="mb-2 flex items-center gap-2">
              <ImageIcon className="size-4 text-violet-400" />

              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                Imagem do personagem
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-violet-400/10 bg-white/[0.04] px-3 focus-within:border-violet-400/45">
              <Link2 className="size-4 shrink-0 text-zinc-600" />

              <input
                type="url"
                inputMode="url"
                value={
                  sheet.imageUrl ??
                  ""
                }
                onChange={(
                  event,
                ) =>
                  updateBaseField(
                    divisionId,
                    sheet.id,
                    "imageUrl",
                    event.target
                      .value,
                  )
                }
                placeholder="https://galeria-assets.com/personagem.webp"
                className="h-11 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-700"
              />
            </div>

            {imageUrl &&
              !validImageUrl && (
                <div className="mt-2 text-xs text-red-300/80">
                  Use somente um link começando com http:// ou https://
                </div>
              )}

            {validImageUrl &&
              imageFailed && (
                <div className="mt-2 text-xs text-amber-300/80">
                  O link é válido, mas a imagem não pôde ser carregada.
                </div>
              )}

            {!imageUrl && (
              <div className="mt-2 text-[10px] leading-4 text-zinc-700">
                Sem upload. A Arena apenas salva o endereço da imagem externa.
              </div>
            )}
          </div>
        )}

        {/* =================================================
            CONTEÚDO DINÂMICO
            ================================================= */}

        <div className="mt-6 space-y-3.5">
          {sheet.blocks.length ===
          0 ? (
            <div className="py-8 text-center">
              <div className="text-sm font-medium text-zinc-600">
                Nenhuma informação adicional.
              </div>

              <div className="mt-1 text-xs text-zinc-700">
                Entre no modo de edição para montar a ficha.
              </div>
            </div>
          ) : editing ? (
            sheet.blocks.map(
              (
                block,
                index,
              ) => (
                <SheetBlockEditor
                  key={
                    block.id
                  }
                  divisionId={
                    divisionId
                  }
                  sheetId={
                    sheet.id
                  }
                  block={
                    block
                  }
                  isFirst={
                    index ===
                    0
                  }
                  isLast={
                    index ===
                    sheet.blocks
                      .length -
                      1
                  }
                />
              ),
            )
          ) : (
            sheet.blocks.map(
              (block) => (
                <SheetBlockView
                  key={
                    block.id
                  }
                  block={
                    block
                  }
                />
              ),
            )
          )}
        </div>

        {/* =================================================
            ADICIONAR OPÇÕES
            ================================================= */}

        {editing && (
          <div className="mt-6 border-t border-white/[0.06] pt-5">

            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
              <Plus className="size-3.5" />
              Adicionar conteúdo
            </div>

            <div className="grid grid-cols-3 gap-2">

              <button
                type="button"
                onClick={() =>
                  createOption(
                    "heading",
                  )
                }
                className="rounded-xl border border-white/10 bg-white/[0.02] px-2 py-3 text-xs font-semibold text-zinc-400 transition hover:border-violet-500/30 hover:bg-violet-500/[0.07] hover:text-white"
              >
                Título
              </button>

              <button
                type="button"
                onClick={() =>
                  createOption(
                    "field",
                  )
                }
                className="rounded-xl border border-white/10 bg-white/[0.02] px-2 py-3 text-xs font-semibold text-zinc-400 transition hover:border-violet-500/30 hover:bg-violet-500/[0.07] hover:text-white"
              >
                Campo
              </button>

              <button
                type="button"
                onClick={() =>
                  createOption(
                    "entry",
                  )
                }
                className="rounded-xl border border-white/10 bg-white/[0.02] px-2 py-3 text-xs font-semibold text-zinc-400 transition hover:border-violet-500/30 hover:bg-violet-500/[0.07] hover:text-white"
              >
                Opção
              </button>
            </div>

            <div className="mt-3 text-[10px] leading-4 text-zinc-700">
              Título cria uma seção • Campo cria uma informação simples • Opção cria habilidade, item ou entrada detalhada
            </div>
          </div>
        )}
      </div>
    </ExpandableSheetFrame>
  )
}

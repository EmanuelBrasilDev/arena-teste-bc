import {
  Crosshair,
  Image as ImageIcon,
  Link2,
  MapPin,
  Move,
  Plus,
  RotateCcw,
  Trash2,
  UserRound,
  Users,
} from "lucide-react"

import {
  useEffect,
  useMemo,
  useState,
} from "react"

import type {
  DragEvent,
} from "react"

import {
  MAP_GRID_SIZE,
  useMapStore,
} from "@/stores/map-store"

import {
  useDataStore,
} from "@/stores/data-store"

import type {
  CharacterSheet,
} from "@/types/data"

import type {
  MapToken,
} from "@/types/map"

function validUrl(
  value: string | undefined,
) {
  if (!value) {
    return false
  }

  try {
    const url =
      new URL(
        value.trim(),
      )

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

function initials(
  name: string,
) {
  const parts =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)

  if (
    parts.length === 0
  ) {
    return "?"
  }

  if (
    parts.length === 1
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

type ResolvedToken = {
  token: MapToken
  name: string
  imageUrl: string
  source:
    | "Ficha"
    | "Token"
}

function TokenPortrait({
  name,
  imageUrl,
  color,
  selected = false,
}: {
  name: string
  imageUrl: string
  color: string
  selected?: boolean
}) {
  const [
    failed,
    setFailed,
  ] =
    useState(false)

  useEffect(() => {
    setFailed(false)
  }, [imageUrl])

  const showImage =
    validUrl(
      imageUrl,
    ) &&
    !failed

  return (
    <div
      className={[
        "relative flex size-full items-center justify-center overflow-hidden rounded-full border-2 font-black text-white shadow-lg",
        selected
          ? "border-white ring-4 ring-violet-400/35"
          : "border-white/45",
      ].join(" ")}
      style={{
        backgroundColor:
          color,

        boxShadow:
          `0 8px 26px -8px ${color}`,
      }}
    >
      {showImage ? (
        <img
          src={
            imageUrl
          }
          alt=""
          draggable={
            false
          }
          onError={() =>
            setFailed(true)
          }
          className="pointer-events-none size-full select-none object-cover"
        />
      ) : (
        <span className="pointer-events-none select-none text-[clamp(8px,1vw,12px)]">
          {initials(
            name,
          )}
        </span>
      )}

      <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/15" />
    </div>
  )
}

export function BattleMap() {
  const tokens =
    useMapStore(
      (state) =>
        state.tokens,
    )

  const selectedTokenId =
    useMapStore(
      (state) =>
        state.selectedTokenId,
    )

  const backgroundImageUrl =
    useMapStore(
      (state) =>
        state.backgroundImageUrl,
    )

  const setBackgroundImageUrl =
    useMapStore(
      (state) =>
        state.setBackgroundImageUrl,
    )

  const addPlayerToken =
    useMapStore(
      (state) =>
        state.addPlayerToken,
    )

  const addNpcToken =
    useMapStore(
      (state) =>
        state.addNpcToken,
    )

  const removeToken =
    useMapStore(
      (state) =>
        state.removeToken,
    )

  const moveToken =
    useMapStore(
      (state) =>
        state.moveToken,
    )

  const selectToken =
    useMapStore(
      (state) =>
        state.selectToken,
    )

  const clearTokens =
    useMapStore(
      (state) =>
        state.clearTokens,
    )

  const divisions =
    useDataStore(
      (state) =>
        state.divisions,
    )

  const [
    draggedTokenId,
    setDraggedTokenId,
  ] =
    useState<string | null>(
      null,
    )

  const [
    playerSheetId,
    setPlayerSheetId,
  ] =
    useState("")

  const [
    npcName,
    setNpcName,
  ] =
    useState("")

  const [
    npcImageUrl,
    setNpcImageUrl,
  ] =
    useState("")

  const [
    backgroundFailed,
    setBackgroundFailed,
  ] =
    useState(false)

  useEffect(() => {
    setBackgroundFailed(
      false,
    )
  }, [backgroundImageUrl])

  const sheets =
    useMemo(
      () =>
        divisions.flatMap(
          (division) =>
            division.sheets,
        ),
      [divisions],
    )

  const sheetById =
    useMemo(
      () =>
        new Map<
          string,
          CharacterSheet
        >(
          sheets.map(
            (sheet) => [
              sheet.id,
              sheet,
            ],
          ),
        ),
      [sheets],
    )

  function resolveToken(
    token: MapToken,
  ): ResolvedToken {
    if (
      token.type ===
        "player" &&
      token.characterSheetId
    ) {
      const sheet =
        sheetById.get(
          token.characterSheetId,
        )

      if (sheet) {
        return {
          token,

          name:
            sheet.name,

          imageUrl:
            sheet.imageUrl ??
            "",

          source:
            "Ficha",
        }
      }
    }

    return {
      token,

      name:
        token.name,

      imageUrl:
        token.imageUrl ??
        "",

      source:
        "Token",
    }
  }

  const resolvedTokens =
    tokens.map(
      resolveToken,
    )

  const selected =
    selectedTokenId
      ? resolvedTokens.find(
          (item) =>
            item.token.id ===
            selectedTokenId,
        ) ?? null
      : null

  function createPlayer() {
    if (
      !playerSheetId
    ) {
      window.alert(
        "Selecione uma ficha.",
      )

      return
    }

    const sheet =
      sheetById.get(
        playerSheetId,
      )

    if (!sheet) {
      window.alert(
        "Ficha não encontrada.",
      )

      return
    }

    const created =
      addPlayerToken(
        sheet.id,
        sheet.name,
      )

    if (!created) {
      window.alert(
        "Esse Player já está no mapa ou não existe espaço disponível.",
      )
    }
  }

  function createNpc() {
    if (
      !npcName.trim()
    ) {
      window.alert(
        "Informe um nome para o NPC.",
      )

      return
    }

    if (
      npcImageUrl.trim() &&
      !validUrl(
        npcImageUrl,
      )
    ) {
      window.alert(
        "O link da imagem precisa começar com http:// ou https://.",
      )

      return
    }

    const created =
      addNpcToken(
        npcName,
        npcImageUrl,
      )

    if (!created) {
      window.alert(
        "Não existe espaço disponível no mapa.",
      )

      return
    }

    setNpcName("")
    setNpcImageUrl("")
  }

  function moveSelected(
    x: number,
    y: number,
  ) {
    if (!selectedTokenId) {
      return
    }

    moveToken(
      selectedTokenId,
      x,
      y,
    )
  }

  function handleDrop(
    event:
      DragEvent<HTMLButtonElement>,
    x: number,
    y: number,
  ) {
    event.preventDefault()

    const tokenId =
      draggedTokenId ??
      event.dataTransfer.getData(
        "text/plain",
      )

    if (!tokenId) {
      return
    }

    moveToken(
      tokenId,
      x,
      y,
    )

    selectToken(
      tokenId,
    )

    setDraggedTokenId(
      null,
    )
  }

  function askClear() {
    if (
      tokens.length ===
      0
    ) {
      return
    }

    const confirmed =
      window.confirm(
        "Remover todos os Tokens do mapa?",
      )

    if (!confirmed) {
      return
    }

    clearTokens()
  }

  const cells =
    Array.from(
      {
        length:
          MAP_GRID_SIZE *
          MAP_GRID_SIZE,
      },
      (
        _,
        index,
      ) => ({
        x:
          index %
          MAP_GRID_SIZE,

        y:
          Math.floor(
            index /
              MAP_GRID_SIZE,
          ),
      }),
    )

  const showBackground =
    validUrl(
      backgroundImageUrl,
    ) &&
    !backgroundFailed

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">

      {/* =====================================
          MAPA
          ===================================== */}

      <section className="min-w-0">

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Crosshair className="size-4 text-violet-400" />
              Campo de Batalha
            </div>

            <div className="mt-1 text-xs text-zinc-600">
              Grid 10×10
            </div>
          </div>

          <button
            type="button"
            onClick={
              askClear
            }
            disabled={
              tokens.length ===
              0
            }
            title="Limpar Tokens"
            className="flex size-9 items-center justify-center rounded-lg border border-white/10 text-zinc-500 transition hover:bg-white/5 hover:text-white disabled:pointer-events-none disabled:opacity-25"
          >
            <RotateCcw className="size-4" />
          </button>
        </div>

        {/* URL DO MAPA */}

        <div className="mx-auto mb-4 max-w-[820px] rounded-xl border border-violet-400/10 bg-violet-500/[0.025] p-3">

          <div className="mb-2 flex items-center gap-2">
            <ImageIcon className="size-4 text-violet-400" />

            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
              Imagem do mapa
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/25 px-3 focus-within:border-violet-500/40">
            <Link2 className="size-4 shrink-0 text-zinc-600" />

            <input
              type="url"
              inputMode="url"
              value={
                backgroundImageUrl
              }
              onChange={(
                event,
              ) =>
                setBackgroundImageUrl(
                  event.target
                    .value,
                )
              }
              placeholder="https://seu-asset-hub.vercel.app/mapas/mapa.webp"
              className="h-10 min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-zinc-700"
            />

            {backgroundImageUrl && (
              <button
                type="button"
                onClick={() =>
                  setBackgroundImageUrl(
                    "",
                  )
                }
                className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 transition hover:text-white"
              >
                Limpar
              </button>
            )}
          </div>

          {backgroundImageUrl &&
            !validUrl(
              backgroundImageUrl,
            ) && (
              <div className="mt-2 text-xs text-red-300">
                Informe um link http:// ou https://.
              </div>
            )}

          {backgroundFailed && (
            <div className="mt-2 text-xs text-amber-300">
              O link é válido, mas a imagem não pôde ser carregada.
            </div>
          )}
        </div>

        <div className="mx-auto w-full max-w-[820px]">

          <div className="mb-1 grid grid-cols-[24px_repeat(10,minmax(0,1fr))]">
            <div />

            {Array.from(
              {
                length:
                  MAP_GRID_SIZE,
              },
              (
                _,
                index,
              ) => (
                <div
                  key={
                    index
                  }
                  className="text-center font-mono text-[9px] font-bold text-zinc-700"
                >
                  {String.fromCharCode(
                    65 +
                      index,
                  )}
                </div>
              ),
            )}
          </div>

          <div className="grid grid-cols-[24px_minmax(0,1fr)]">

            <div
              className="grid"
              style={{
                gridTemplateRows:
                  `repeat(${MAP_GRID_SIZE}, minmax(0, 1fr))`,
              }}
            >
              {Array.from(
                {
                  length:
                    MAP_GRID_SIZE,
                },
                (
                  _,
                  index,
                ) => (
                  <div
                    key={
                      index
                    }
                    className="flex items-center justify-center font-mono text-[9px] font-bold text-zinc-700"
                  >
                    {index +
                      1}
                  </div>
                ),
              )}
            </div>

            <div className="relative aspect-square overflow-hidden rounded-2xl border border-violet-400/25 bg-[#11141b] shadow-[0_30px_80px_-42px_rgba(124,58,237,0.95)]">

              {showBackground ? (
                <>
                  <img
                    src={
                      backgroundImageUrl
                    }
                    alt="Mapa de batalha"
                    onError={() =>
                      setBackgroundFailed(
                        true,
                      )
                    }
                    className="pointer-events-none absolute inset-0 size-full select-none object-cover"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-black/10" />
                </>
              ) : (
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(74,222,128,0.08),transparent_28%),radial-gradient(circle_at_75%_70%,rgba(59,130,246,0.08),transparent_35%),linear-gradient(145deg,#171b1b,#0d1017)]" />
              )}

              <div
                className="relative grid size-full"
                style={{
                  gridTemplateColumns:
                    `repeat(${MAP_GRID_SIZE}, minmax(0, 1fr))`,

                  gridTemplateRows:
                    `repeat(${MAP_GRID_SIZE}, minmax(0, 1fr))`,
                }}
              >
                {cells.map(
                  ({
                    x,
                    y,
                  }) => {
                    const resolved =
                      resolvedTokens.find(
                        (item) =>
                          item.token.x ===
                            x &&
                          item.token.y ===
                            y,
                      )

                    const token =
                      resolved?.token

                    const isSelected =
                      token?.id ===
                      selectedTokenId

                    return (
                      <button
                        key={`${x}-${y}`}
                        type="button"
                        onClick={() => {
                          if (
                            token
                          ) {
                            selectToken(
                              token.id,
                            )

                            return
                          }

                          moveSelected(
                            x,
                            y,
                          )
                        }}
                        onDragOver={(
                          event,
                        ) =>
                          event.preventDefault()
                        }
                        onDrop={(
                          event,
                        ) =>
                          handleDrop(
                            event,
                            x,
                            y,
                          )
                        }
                        className={[
                          "relative flex min-h-0 min-w-0 items-center justify-center border-b border-r border-white/20 transition",
                          !token &&
                          selectedTokenId
                            ? "hover:bg-violet-500/15"
                            : "",
                        ].join(
                          " ",
                        )}
                      >
                        {token &&
                          resolved && (
                          <div
                            draggable
                            onDragStart={(
                              event,
                            ) => {
                              event.dataTransfer.setData(
                                "text/plain",
                                token.id,
                              )

                              setDraggedTokenId(
                                token.id,
                              )

                              selectToken(
                                token.id,
                              )
                            }}
                            onDragEnd={() =>
                              setDraggedTokenId(
                                null,
                              )
                            }
                            title={
                              resolved.name
                            }
                            className={[
                              "relative size-[72%] max-h-14 max-w-14 cursor-grab transition active:cursor-grabbing",
                              isSelected
                                ? "scale-110"
                                : "hover:scale-105",
                            ].join(
                              " ",
                            )}
                          >
                            <TokenPortrait
                              name={
                                resolved.name
                              }
                              imageUrl={
                                resolved.imageUrl
                              }
                              color={
                                token.color
                              }
                              selected={
                                isSelected
                              }
                            />
                          </div>
                        )}

                        <span className="pointer-events-none absolute bottom-0.5 right-1 font-mono text-[7px] text-white/25">
                          {String.fromCharCode(
                            65 +
                              x,
                          )}
                          {y +
                            1}
                        </span>
                      </button>
                    )
                  },
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-4 flex max-w-[820px] items-center gap-2 text-[10px] leading-4 text-zinc-600">
          <Move className="size-3.5 shrink-0" />

          <span>
            Arraste no desktop ou selecione um Token e toque em outra casa.
          </span>
        </div>
      </section>

      {/* =====================================
          PAINEL
          ===================================== */}

      <aside className="space-y-4">

        {/* PLAYER */}

        <div className="rounded-2xl border border-violet-400/15 bg-[#0d0d13] p-4">

          <div className="mb-3 flex items-center gap-2">
            <UserRound className="size-4 text-violet-400" />

            <div>
              <div className="text-sm font-semibold text-white">
                Player
              </div>

              <div className="text-[10px] text-zinc-600">
                Vinculado à ficha
              </div>
            </div>
          </div>

          {sheets.length >
          0 ? (
            <>
              <select
                value={
                  playerSheetId
                }
                onChange={(
                  event,
                ) =>
                  setPlayerSheetId(
                    event.target
                      .value,
                  )
                }
                className="h-10 w-full rounded-lg border border-white/10 bg-[#111118] px-3 text-xs text-white outline-none focus:border-violet-500/40"
              >
                <option value="">
                  Selecionar ficha...
                </option>

                {sheets.map(
                  (sheet) => (
                    <option
                      key={
                        sheet.id
                      }
                      value={
                        sheet.id
                      }
                    >
                      {
                        sheet.name
                      }
                    </option>
                  ),
                )}
              </select>

              <button
                type="button"
                onClick={
                  createPlayer
                }
                className="mt-2 flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-violet-600 text-xs font-semibold text-white transition hover:bg-violet-500"
              >
                <Plus className="size-4" />
                Adicionar Player
              </button>

              <div className="mt-2 text-[9px] leading-4 text-zinc-700">
                Nome e retrato são lidos automaticamente da ficha em Dados.
              </div>
            </>
          ) : (
            <div className="text-xs leading-5 text-zinc-600">
              Crie uma ficha na aba Dados para testar um Token de Player.
            </div>
          )}
        </div>

        {/* NPC */}

        <div className="rounded-2xl border border-cyan-400/10 bg-[#0d0d13] p-4">

          <div className="mb-3 flex items-center gap-2">
            <MapPin className="size-4 text-cyan-400" />

            <div>
              <div className="text-sm font-semibold text-white">
                NPC / Avulso
              </div>

              <div className="text-[10px] text-zinc-600">
                Não exige ficha
              </div>
            </div>
          </div>

          <div className="space-y-2">

            <input
              value={
                npcName
              }
              onChange={(
                event,
              ) =>
                setNpcName(
                  event.target
                    .value,
                )
              }
              placeholder="Nome do NPC"
              className="h-10 w-full rounded-lg border border-white/10 bg-black/20 px-3 text-xs text-white outline-none focus:border-cyan-500/40"
            />

            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 focus-within:border-cyan-500/40">
              <Link2 className="size-3.5 shrink-0 text-zinc-600" />

              <input
                type="url"
                inputMode="url"
                value={
                  npcImageUrl
                }
                onChange={(
                  event,
                ) =>
                  setNpcImageUrl(
                    event.target
                      .value,
                  )
                }
                placeholder="URL da imagem"
                className="h-10 min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-zinc-700"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={
              createNpc
            }
            className="mt-2 flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/20 bg-cyan-500/10 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/15"
          >
            <Plus className="size-4" />
            Adicionar NPC
          </button>
        </div>

        {/* TOKENS ATIVOS */}

        <div className="rounded-2xl border border-white/10 bg-[#0d0d13] p-4">

          <div className="mb-4 flex items-center gap-2">
            <Users className="size-4 text-violet-400" />

            <div>
              <div className="text-sm font-semibold text-white">
                Tokens
              </div>

              <div className="text-[10px] text-zinc-600">
                {tokens.length} / 100
              </div>
            </div>
          </div>

          {resolvedTokens.length >
          0 ? (
            <div className="arena-scrollbar max-h-[330px] space-y-2 overflow-y-auto pr-1">

              {resolvedTokens.map(
                (resolved) => {
                  const {
                    token,
                  } = resolved

                  const active =
                    token.id ===
                    selectedTokenId

                  return (
                    <button
                      key={
                        token.id
                      }
                      type="button"
                      onClick={() =>
                        selectToken(
                          token.id,
                        )
                      }
                      className={[
                        "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition",
                        active
                          ? "border-violet-400/30 bg-violet-500/10"
                          : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]",
                      ].join(
                        " ",
                      )}
                    >
                      <span className="size-9 shrink-0">
                        <TokenPortrait
                          name={
                            resolved.name
                          }
                          imageUrl={
                            resolved.imageUrl
                          }
                          color={
                            token.color
                          }
                        />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-semibold text-white">
                          {
                            resolved.name
                          }
                        </span>

                        <span className="mt-0.5 block font-mono text-[9px] text-zinc-600">
                          {String.fromCharCode(
                            65 +
                              token.x,
                          )}
                          {token.y +
                            1}
                          {" • "}
                          {
                            resolved.source
                          }
                        </span>
                      </span>
                    </button>
                  )
                },
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 py-7 text-center text-xs text-zinc-600">
              Nenhum Token
            </div>
          )}

          {selected && (
            <div className="mt-4 border-t border-white/[0.07] pt-4">

              <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                Selecionado
              </div>

              <div className="mt-2 text-sm font-semibold text-white">
                {
                  selected.name
                }
              </div>

              <div className="mt-1 font-mono text-xs text-violet-300">
                {String.fromCharCode(
                  65 +
                    selected.token.x,
                )}
                {selected.token.y +
                  1}
              </div>

              <div className="mt-1 text-[9px] uppercase tracking-[0.15em] text-zinc-600">
                Imagem:{" "}
                {
                  selected.source
                }
              </div>

              <button
                type="button"
                onClick={() =>
                  removeToken(
                    selected.token
                      .id,
                  )
                }
                className="mt-4 flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-red-400/15 bg-red-500/[0.055] text-xs font-semibold text-red-300 transition hover:bg-red-500/10"
              >
                <Trash2 className="size-4" />
                Excluir Token
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}

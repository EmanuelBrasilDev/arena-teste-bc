import {
  Plus,
  ShieldPlus,
  Skull,
  Trash2,
} from "lucide-react"

import {
  useState,
} from "react"

import {
  useSubstatusStore,
} from "@/stores/substatus-store"

import type {
  CharacterSubstatusSheet,
  SubstatusKind,
} from "@/types/substatus"

type Props = {
  sheet:
    CharacterSubstatusSheet
}

export function SubstatusCharacterCard({
  sheet,
}: Props) {
  const [
    editing,
    setEditing,
  ] =
    useState(false)

  const renameCharacter =
    useSubstatusStore(
      (state) =>
        state.renameCharacter,
    )

  const removeCharacter =
    useSubstatusStore(
      (state) =>
        state.removeCharacter,
    )

  const addStatus =
    useSubstatusStore(
      (state) =>
        state.addStatus,
    )

  const updateStatus =
    useSubstatusStore(
      (state) =>
        state.updateStatus,
    )

  const removeStatus =
    useSubstatusStore(
      (state) =>
        state.removeStatus,
    )

  function add(
    kind:
      SubstatusKind,
  ) {
    addStatus(
      sheet.id,
      kind,
    )

    setEditing(true)
  }

  function askDelete() {
    const confirmed =
      window.confirm(
        `Excluir os Substatus de "${sheet.characterName}"?`,
      )

    if (!confirmed) {
      return
    }

    removeCharacter(
      sheet.id,
    )
  }

  const buffs =
    sheet.statuses.filter(
      (status) =>
        status.kind ===
        "buff",
    )

  const debuffs =
    sheet.statuses.filter(
      (status) =>
        status.kind ===
        "debuff",
    )

  return (
    <article className="overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(145deg,rgba(23,23,32,0.95),rgba(7,8,15,0.98))] shadow-[0_24px_70px_-46px_rgba(139,92,246,0.85)]">
      {/* HEADER */}

      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] px-5 py-4">

        <div className="min-w-0 flex-1">
          {editing ? (
            <input
              value={
                sheet.characterName
              }
              onChange={(
                event,
              ) =>
                renameCharacter(
                  sheet.id,
                  event
                    .target
                    .value,
                )
              }
              className="h-10 w-full bg-transparent text-lg font-bold text-white outline-none"
            />
          ) : (
            <>
              <div className="text-lg font-black text-white">
                {
                  sheet.characterName
                }
              </div>

              <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.22em] text-zinc-600">
                Substatus ativos
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-1">

          <button
            type="button"
            onClick={() =>
              setEditing(
                (value) =>
                  !value,
              )
            }
            className={[
              "h-9 rounded-lg px-3 text-xs font-semibold transition",
              editing
                ? "bg-violet-600 text-white"
                : "text-zinc-400 hover:bg-white/5 hover:text-white",
            ].join(" ")}
          >
            {editing
              ? "Concluir"
              : "Editar"}
          </button>

          <button
            type="button"
            onClick={
              askDelete
            }
            className="flex size-9 items-center justify-center rounded-lg text-zinc-700 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </header>

      {/* LISTAGEM */}

      <div className="space-y-6 p-5">

        {debuffs.length >
          0 && (
          <section>
            <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-red-300">
              <Skull className="size-3.5" />
              Debuffs
            </div>

            <div className="space-y-2">
              {debuffs.map(
                (status) => (
                  <div
                    key={
                      status.id
                    }
                    className="rounded-xl border border-red-400/10 bg-red-500/[0.045] px-4 py-3"
                  >
                    {editing ? (
                      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_110px_100px_auto]">

                        <input
                          value={
                            status.name
                          }
                          onChange={(
                            event,
                          ) =>
                            updateStatus(
                              sheet.id,
                              status.id,
                              {
                                name:
                                  event
                                    .target
                                    .value,
                              },
                            )
                          }
                          placeholder="Nome"
                          className="h-10 rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-white outline-none"
                        />

                        <input
                          value={
                            status.quantity
                          }
                          onChange={(
                            event,
                          ) =>
                            updateStatus(
                              sheet.id,
                              status.id,
                              {
                                quantity:
                                  event
                                    .target
                                    .value,
                              },
                            )
                          }
                          placeholder="5d3"
                          className="h-10 rounded-lg border border-white/10 bg-black/20 px-3 font-mono text-sm text-white outline-none"
                        />

                        <input
                          value={
                            status.duration
                          }
                          onChange={(
                            event,
                          ) =>
                            updateStatus(
                              sheet.id,
                              status.id,
                              {
                                duration:
                                  event
                                    .target
                                    .value,
                              },
                            )
                          }
                          placeholder="3c"
                          className="h-10 rounded-lg border border-white/10 bg-black/20 px-3 font-mono text-sm text-white outline-none"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeStatus(
                              sheet.id,
                              status.id,
                            )
                          }
                          className="flex size-10 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-red-500/10 hover:text-red-300"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-baseline justify-between gap-3">
                        <div className="font-semibold text-white">
                          -{" "}
                          {
                            status.name
                          }
                        </div>

                        <div className="flex flex-wrap gap-2 font-mono text-xs">
                          {status.quantity && (
                            <span className="rounded-md border border-red-400/15 bg-red-500/10 px-2 py-1 text-red-200">
                              {
                                status.quantity
                              }
                            </span>
                          )}

                          {status.duration && (
                            <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-zinc-300">
                              {
                                status.duration
                              }
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ),
              )}
            </div>
          </section>
        )}

        {buffs.length >
          0 && (
          <section>
            <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-300">
              <ShieldPlus className="size-3.5" />
              Buffs
            </div>

            <div className="space-y-2">
              {buffs.map(
                (status) => (
                  <div
                    key={
                      status.id
                    }
                    className="rounded-xl border border-emerald-400/10 bg-emerald-500/[0.045] px-4 py-3"
                  >
                    {editing ? (
                      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_110px_100px_auto]">

                        <input
                          value={
                            status.name
                          }
                          onChange={(
                            event,
                          ) =>
                            updateStatus(
                              sheet.id,
                              status.id,
                              {
                                name:
                                  event
                                    .target
                                    .value,
                              },
                            )
                          }
                          placeholder="Nome"
                          className="h-10 rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-white outline-none"
                        />

                        <input
                          value={
                            status.quantity
                          }
                          onChange={(
                            event,
                          ) =>
                            updateStatus(
                              sheet.id,
                              status.id,
                              {
                                quantity:
                                  event
                                    .target
                                    .value,
                              },
                            )
                          }
                          placeholder="+20%"
                          className="h-10 rounded-lg border border-white/10 bg-black/20 px-3 font-mono text-sm text-white outline-none"
                        />

                        <input
                          value={
                            status.duration
                          }
                          onChange={(
                            event,
                          ) =>
                            updateStatus(
                              sheet.id,
                              status.id,
                              {
                                duration:
                                  event
                                    .target
                                    .value,
                              },
                            )
                          }
                          placeholder="2c"
                          className="h-10 rounded-lg border border-white/10 bg-black/20 px-3 font-mono text-sm text-white outline-none"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeStatus(
                              sheet.id,
                              status.id,
                            )
                          }
                          className="flex size-10 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-red-500/10 hover:text-red-300"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-baseline justify-between gap-3">
                        <div className="font-semibold text-white">
                          -{" "}
                          {
                            status.name
                          }
                        </div>

                        <div className="flex flex-wrap gap-2 font-mono text-xs">
                          {status.quantity && (
                            <span className="rounded-md border border-emerald-400/15 bg-emerald-500/10 px-2 py-1 text-emerald-200">
                              {
                                status.quantity
                              }
                            </span>
                          )}

                          {status.duration && (
                            <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-zinc-300">
                              {
                                status.duration
                              }
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ),
              )}
            </div>
          </section>
        )}

        {sheet.statuses.length ===
          0 && (
          <div className="py-8 text-center text-sm text-zinc-600">
            Nenhum Substatus ativo.
          </div>
        )}

        {editing && (
          <div className="grid grid-cols-2 gap-2 border-t border-white/[0.06] pt-4">

            <button
              type="button"
              onClick={() =>
                add(
                  "debuff",
                )
              }
              className="flex h-10 items-center justify-center gap-2 rounded-xl border border-red-400/15 bg-red-500/[0.06] text-xs font-semibold text-red-200 transition hover:bg-red-500/10"
            >
              <Plus className="size-4" />
              Debuff
            </button>

            <button
              type="button"
              onClick={() =>
                add(
                  "buff",
                )
              }
              className="flex h-10 items-center justify-center gap-2 rounded-xl border border-emerald-400/15 bg-emerald-500/[0.06] text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/10"
            >
              <Plus className="size-4" />
              Buff
            </button>
          </div>
        )}
      </div>
    </article>
  )
}

import {
  Eraser,
  MessageCircle,
  Send,
  Sparkles,
} from "lucide-react"

import {
  useEffect,
  useRef,
  useState,
} from "react"

import {
  DiceResultCard,
} from "@/components/dice/DiceResultCard"

import {
  useArenaStore,
} from "@/stores/arena-store"

import type {
  DiceEffect,
  DiceVisualStyle,
} from "@/types/arena"

const effects: Array<{
  value: DiceEffect
  label: string
  dot: string
}> = [
  {
    value: "none",
    label: "Neutro",
    dot: "bg-zinc-400",
  },
  {
    value: "fire",
    label: "Fogo",
    dot: "bg-orange-400",
  },
  {
    value: "ice",
    label: "Gelo",
    dot: "bg-cyan-300",
  },
  {
    value:
      "electric",
    label:
      "Elétrico",
    dot:
      "bg-yellow-300",
  },
  {
    value:
      "poison",
    label:
      "Veneno",
    dot:
      "bg-emerald-400",
  },
  {
    value:
      "arcane",
    label:
      "Arcano",
    dot:
      "bg-violet-400",
  },
]

const styles: Array<{
  value:
    DiceVisualStyle
  label: string
}> = [
  {
    value:
      "classic",
    label:
      "Clássico",
  },
  {
    value:
      "obsidian",
    label:
      "Obsidiana",
  },
  {
    value:
      "arcane",
    label:
      "Arcano",
  },
  {
    value:
      "tech",
    label:
      "Tech",
  },
]

export function ArenaTab() {
  const [
    input,
    setInput,
  ] =
    useState("")

  const scrollRef =
    useRef<HTMLDivElement>(
      null,
    )

  const messages =
    useArenaStore(
      (state) =>
        state.messages,
    )

  const sendMessage =
    useArenaStore(
      (state) =>
        state.sendMessage,
    )

  const clearChat =
    useArenaStore(
      (state) =>
        state.clearChat,
    )

  const selectedEffect =
    useArenaStore(
      (state) =>
        state.selectedEffect,
    )

  const selectedStyle =
    useArenaStore(
      (state) =>
        state.selectedStyle,
    )

  const quickExpression =
    useArenaStore(
      (state) =>
        state.quickExpression,
    )

  const setSelectedEffect =
    useArenaStore(
      (state) =>
        state.setSelectedEffect,
    )

  const setSelectedStyle =
    useArenaStore(
      (state) =>
        state.setSelectedStyle,
    )

  const setQuickExpression =
    useArenaStore(
      (state) =>
        state.setQuickExpression,
    )

  const quickRoll =
    useArenaStore(
      (state) =>
        state.quickRoll,
    )

  useEffect(() => {
    const element =
      scrollRef.current

    if (!element) {
      return
    }

    element.scrollTo({
      top:
        element.scrollHeight,
      behavior:
        "smooth",
    })
  }, [messages.length])

  function submitMessage() {
    const value =
      input.trim()

    if (!value) {
      return
    }

    sendMessage(value)

    setInput("")
  }

  return (
    <div className="min-h-[650px]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">

        <div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.9)]" />

            <h2 className="text-lg font-semibold text-white">
              Arena
            </h2>
          </div>

          <p className="mt-1 text-sm text-zinc-500">
            Conversas, comandos e rolagens acontecem aqui.
          </p>
        </div>

        <div className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
          Sessão local
        </div>
      </div>

      <div className="grid min-h-[600px] gap-0 xl:grid-cols-[290px_1px_minmax(0,1fr)]">

        <aside className="pr-0 xl:pr-6">

          <div className="mb-6 flex items-center gap-2">
            <Sparkles className="size-4 text-violet-400" />

            <span className="text-sm font-semibold text-white">
              Dado 3D
            </span>
          </div>

          <div className="mb-7">
            <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-600">
              Efeito
            </div>

            <div className="grid grid-cols-2 gap-2">
              {effects.map(
                (
                  effect,
                ) => {
                  const active =
                    selectedEffect ===
                    effect.value

                  return (
                    <button
                      key={
                        effect.value
                      }
                      type="button"
                      onClick={() =>
                        setSelectedEffect(
                          effect.value,
                        )
                      }
                      className={[
                        "flex h-11 items-center gap-2 rounded-xl border px-3 text-sm transition-all",
                        active
                          ? "border-violet-500/50 bg-violet-500/10 text-white"
                          : "border-white/10 bg-white/[0.02] text-zinc-400 hover:border-white/20 hover:text-white",
                      ].join(
                        " ",
                      )}
                    >
                      <span
                        className={[
                          "size-2.5 rounded-full",
                          effect.dot,
                        ].join(
                          " ",
                        )}
                      />

                      {
                        effect.label
                      }
                    </button>
                  )
                },
              )}
            </div>
          </div>

          <div className="mb-7">
            <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-600">
              Estilo do dado
            </div>

            <div className="grid grid-cols-2 gap-2">
              {styles.map(
                (
                  style,
                ) => {
                  const active =
                    selectedStyle ===
                    style.value

                  return (
                    <button
                      key={
                        style.value
                      }
                      type="button"
                      onClick={() =>
                        setSelectedStyle(
                          style.value,
                        )
                      }
                      className={[
                        "h-11 rounded-xl border px-3 text-sm transition-all",
                        active
                          ? "border-violet-500/50 bg-violet-500/10 text-white"
                          : "border-white/10 bg-white/[0.02] text-zinc-400 hover:border-white/20 hover:text-white",
                      ].join(
                        " ",
                      )}
                    >
                      {
                        style.label
                      }
                    </button>
                  )
                },
              )}
            </div>
          </div>

          <div>
            <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-600">
              Rolagem rápida
            </div>

            <input
              value={
                quickExpression
              }
              onChange={(
                event,
              ) =>
                setQuickExpression(
                  event
                    .target
                    .value,
                )
              }
              onKeyDown={(
                event,
              ) => {
                if (
                  event.key ===
                  "Enter"
                ) {
                  event.preventDefault()

                  quickRoll()
                }
              }}
              placeholder="Ex: d20"
              className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.025] px-3 font-mono text-sm text-white outline-none placeholder:text-zinc-700 focus:border-violet-500/50"
            />

            <button
              type="button"
              onClick={
                quickRoll
              }
              className="mt-2 h-11 w-full rounded-xl bg-violet-600 text-sm font-semibold text-white transition-all hover:bg-violet-500 active:scale-[0.98]"
            >
              Rolar dado
            </button>

            <div className="mt-5 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-700">
              Exemplos
            </div>

            <div className="mt-3 space-y-2 font-mono text-xs text-zinc-600">
              <div>
                d3 → D6 visual
              </div>

              <div>
                d8 → D8 visual
              </div>

              <div>
                d20 → D20 visual
              </div>

              <div>
                d50 → D100 visual
              </div>

              <div>
                d1000 → D100 visual
              </div>
            </div>
          </div>
        </aside>

        <div className="hidden bg-white/10 xl:block" />

        <section className="mt-7 min-w-0 xl:mt-0 xl:pl-6">

          <div className="mb-4 flex items-center justify-between">

            <div className="flex items-center gap-3">
              <MessageCircle className="size-5 text-violet-400" />

              <div>
                <div className="text-sm font-semibold text-white">
                  Chat da Arena
                </div>

                <div className="text-xs text-zinc-500">
                  Texto, comandos e dados
                </div>
              </div>
            </div>

            <button
              type="button"
              title="Limpar chat"
              onClick={
                clearChat
              }
              className="flex size-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Eraser className="size-4" />
            </button>
          </div>

          <div
            ref={
              scrollRef
            }
            className="arena-scrollbar h-[470px] overflow-y-auto border-y border-white/10 py-2 pr-2"
          >
            <div className="divide-y divide-white/[0.06]">

              {messages.map(
                (
                  message,
                ) => (
                  <div
                    key={
                      message.id
                    }
                    className="py-4"
                  >
                    <div className="mb-2 flex items-center justify-between gap-4">

                      <span className="text-sm font-semibold text-white">
                        {
                          message.author
                        }
                      </span>

                      <span className="font-mono text-[11px] text-zinc-600">
                        {
                          message.createdAt
                        }
                      </span>
                    </div>

                    <div className="whitespace-pre-wrap text-sm leading-6 text-zinc-300">
                      {
                        message.content
                      }
                    </div>

                    {message.rolls.map(
                      (
                        roll,
                      ) => (
                        <DiceResultCard
                          key={
                            roll.id
                          }
                          roll={
                            roll
                          }
                        />
                      ),
                    )}
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="pt-4">

            <div className="mb-2 flex flex-wrap gap-2">

              <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-[11px] text-violet-200">
                Efeito:{" "}
                {
                  effects.find(
                    (
                      effect,
                    ) =>
                      effect.value ===
                      selectedEffect,
                  )?.label
                }
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-zinc-300">
                Dado:{" "}
                {
                  styles.find(
                    (
                      style,
                    ) =>
                      style.value ===
                      selectedStyle,
                  )?.label
                }
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] p-1.5 transition-colors focus-within:border-violet-500/40">

              <input
                value={
                  input
                }
                onChange={(
                  event,
                ) =>
                  setInput(
                    event
                      .target
                      .value,
                  )
                }
                onKeyDown={(
                  event,
                ) => {
                  if (
                    event.key ===
                    "Enter"
                  ) {
                    event.preventDefault()

                    submitMessage()
                  }
                }}
                placeholder="Mensagem ou rolagem... Ex: Ataco com d20+5"
                className="h-10 min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-zinc-600"
              />

              <button
                type="button"
                onClick={
                  submitMessage
                }
                className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white transition-all hover:bg-violet-500 active:scale-95"
              >
                <Send className="size-4" />
              </button>
            </div>

            <div className="mt-2 text-[11px] text-zinc-600">
              O resultado oficial vem do motor da Arena • O modelo 3D é somente a representação física
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

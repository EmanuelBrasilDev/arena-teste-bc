import { create } from "zustand"

import {
  rollAllExpressions,
  rollDiceExpression,
} from "@/engine/dice/roller"

import type {
  ChatMessage,
  DiceEffect,
  DiceRollResult,
  DiceVisualStyle,
  RollAnimationItem,
  RollAnimationState,
} from "@/types/arena"

type ArenaState = {
  messages: ChatMessage[]

  selectedEffect: DiceEffect
  selectedStyle: DiceVisualStyle
  quickExpression: string

  rollAnimation: RollAnimationState
  animationQueue: RollAnimationItem[]

  setSelectedEffect:
    (effect: DiceEffect) => void

  setSelectedStyle:
    (style: DiceVisualStyle) => void

  setQuickExpression:
    (expression: string) => void

  sendMessage:
    (content: string) => void

  quickRoll:
    () => void

  clearChat:
    () => void

  enqueueRollAnimation:
    (roll: DiceRollResult) => void

  finishVisualRoll:
    (rollId: string) => void
}

function currentTime() {
  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(new Date())
}

function createMessage(
  content: string,
  rolls: DiceRollResult[],
  author = "Jogador",
): ChatMessage {
  return {
    id: crypto.randomUUID(),
    author,
    content,
    rolls,
    createdAt:
      currentTime(),
  }
}

export const useArenaStore =
  create<ArenaState>(
    (set, get) => ({
      messages: [
        createMessage(
          "Arena iniciada. Escolha o efeito e o estilo visual antes de realizar uma rolagem.",
          [],
          "Arena",
        ),
      ],

      selectedEffect:
        "arcane",

      selectedStyle:
        "classic",

      quickExpression:
        "d20",

      animationQueue: [],

      rollAnimation: {
        visible: false,
        phase: "rolling",
        roll: null,
        effect: "arcane",
        style: "classic",
      },

      setSelectedEffect:
        (effect) => {
          set({
            selectedEffect:
              effect,
          })
        },

      setSelectedStyle:
        (style) => {
          set({
            selectedStyle:
              style,
          })
        },

      setQuickExpression:
        (quickExpression) => {
          set({
            quickExpression,
          })
        },

      enqueueRollAnimation:
        (roll) => {
          const item:
            RollAnimationItem = {
              roll,

              effect:
                get()
                  .selectedEffect,

              style:
                get()
                  .selectedStyle,
            }

          const active =
            get()
              .rollAnimation
              .visible

          if (active) {
            set((state) => ({
              animationQueue: [
                ...state.animationQueue,
                item,
              ],
            }))

            return
          }

          set({
            rollAnimation: {
              visible: true,
              phase: "rolling",
              roll:
                item.roll,
              effect:
                item.effect,
              style:
                item.style,
            },
          })
        },

      finishVisualRoll:
        (rollId) => {
          const current =
            get()
              .rollAnimation

          if (
            !current.visible ||
            current.phase !==
              "rolling" ||
            current.roll?.id !==
              rollId
          ) {
            return
          }

          set({
            rollAnimation: {
              ...current,
              phase: "result",
            },
          })

          window.setTimeout(
            () => {
              const queue =
                get()
                  .animationQueue

              if (
                queue.length >
                0
              ) {
                const [
                  next,
                  ...remaining
                ] = queue

                set({
                  animationQueue:
                    remaining,

                  rollAnimation: {
                    visible:
                      true,

                    phase:
                      "rolling",

                    roll:
                      next.roll,

                    effect:
                      next.effect,

                    style:
                      next.style,
                  },
                })

                return
              }

              set({
                rollAnimation: {
                  visible:
                    false,

                  phase:
                    "rolling",

                  roll:
                    null,

                  effect:
                    get()
                      .selectedEffect,

                  style:
                    get()
                      .selectedStyle,
                },
              })
            },
            1250,
          )
        },

      sendMessage:
        (content) => {
          const clean =
            content.trim()

          if (!clean) {
            return
          }

          let rolls:
            DiceRollResult[] =
            []

          try {
            rolls =
              rollAllExpressions(
                clean,
              )
          } catch (error) {
            console.error(
              error,
            )
          }

          set((state) => ({
            messages: [
              ...state.messages,

              createMessage(
                clean,
                rolls,
              ),
            ],
          }))

          for (
            const roll
            of rolls
          ) {
            get()
              .enqueueRollAnimation(
                roll,
              )
          }
        },

      quickRoll:
        () => {
          const expression =
            get()
              .quickExpression
              .trim()

          if (!expression) {
            return
          }

          try {
            const roll =
              rollDiceExpression(
                expression,
              )

            set((state) => ({
              messages: [
                ...state.messages,

                createMessage(
                  expression,
                  [roll],
                ),
              ],
            }))

            get()
              .enqueueRollAnimation(
                roll,
              )
          } catch (error) {
            console.error(
              error,
            )

            set((state) => ({
              messages: [
                ...state.messages,

                createMessage(
                  `Rolagem inválida: ${expression}`,
                  [],
                  "Arena",
                ),
              ],
            }))
          }
        },

      clearChat:
        () => {
          set({
            messages: [
              createMessage(
                "O histórico da Arena foi limpo.",
                [],
                "Arena",
              ),
            ],
          })
        },
    }),
  )

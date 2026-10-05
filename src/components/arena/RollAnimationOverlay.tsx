import {
  CircleDot,
  Flame,
  Snowflake,
  Sparkles,
  Skull,
  Zap,
} from "lucide-react"

import {
  AnimatePresence,
  motion,
} from "motion/react"

import {
  DiceBoxStage,
} from "@/components/dice/DiceBoxStage"

import {
  getVisualDie,
} from "@/lib/dice-visual"

import {
  useArenaStore,
} from "@/stores/arena-store"

import type {
  DiceEffect,
} from "@/types/arena"

const effectInfo:
  Record<
    DiceEffect,
    {
      label: string
      icon:
        typeof Flame
    }
  > = {
    none: {
      label: "Neutro",
      icon: CircleDot,
    },

    fire: {
      label: "Fogo",
      icon: Flame,
    },

    ice: {
      label: "Gelo",
      icon: Snowflake,
    },

    electric: {
      label:
        "Elétrico",
      icon: Zap,
    },

    poison: {
      label:
        "Veneno",
      icon: Skull,
    },

    arcane: {
      label:
        "Arcano",
      icon: Sparkles,
    },
  }

export function RollAnimationOverlay() {
  const animation =
    useArenaStore(
      (state) =>
        state.rollAnimation,
    )

  const finishVisualRoll =
    useArenaStore(
      (state) =>
        state.finishVisualRoll,
    )

  const roll =
    animation.roll

  const info =
    effectInfo[
      animation.effect
    ]

  const EffectIcon =
    info.icon

  const visualDie =
    roll
      ? getVisualDie(
          roll.sides,
        )
      : 20

  return (
    <>
      {/*
        O canvas permanece montado,
        portanto o DiceBox é inicializado
        uma única vez.
      */}
      <div
        className={[
          "fixed inset-0 z-[220]",
          animation.visible &&
          animation.phase ===
            "rolling"
            ? ""
            : "pointer-events-none opacity-0",
        ].join(" ")}
      >
        <DiceBoxStage
          roll={roll}
          style={
            animation.style
          }
          active={
            animation.visible &&
            animation.phase ===
              "rolling"
          }
          onSettled={
            finishVisualRoll
          }
        />
      </div>

      <AnimatePresence>
        {animation.visible &&
          roll && (
            <motion.div
              key={roll.id}
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className={[
                "pointer-events-none fixed inset-0 z-[200] overflow-hidden",
                "arena-roll-overlay",
                `arena-effect-${animation.effect}`,
              ].join(" ")}
            >
              <div className="absolute inset-0 bg-black/76" />

              <div className="arena-effect-vignette" />

              <div className="arena-edge arena-edge-top" />
              <div className="arena-edge arena-edge-bottom" />
              <div className="arena-edge arena-edge-left" />
              <div className="arena-edge arena-edge-right" />

              <div className="arena-corner arena-corner-tl" />
              <div className="arena-corner arena-corner-tr" />
              <div className="arena-corner arena-corner-bl" />
              <div className="arena-corner arena-corner-br" />

              {animation.effect ===
                "fire" && (
                <div className="arena-fire-layer">
                  {Array.from({
                    length: 22,
                  }).map(
                    (
                      _,
                      index,
                    ) => (
                      <span
                        key={
                          index
                        }
                        className="arena-fire-particle"
                        style={{
                          left:
                            `${(index * 19) % 100}%`,

                          animationDelay:
                            `${-(index % 9) * 0.14}s`,

                          animationDuration:
                            `${1.1 + (index % 6) * 0.12}s`,
                        }}
                      />
                    ),
                  )}
                </div>
              )}

              {animation.phase ===
                "rolling" && (
                <div className="absolute inset-x-0 bottom-[9%] z-[220] text-center">
                  <div className="mb-3 flex items-center justify-center gap-2">
                    <EffectIcon className="size-4 text-white/70" />

                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/60">
                      {
                        info.label
                      }
                    </span>
                  </div>

                  <div className="font-mono text-xl font-bold text-white">
                    {
                      roll.expression
                    }
                  </div>

                  <div className="mt-2 text-[10px] uppercase tracking-[0.22em] text-white/35">
                    D
                    {
                      roll.sides
                    }
                    {" → "}
                    modelo visual D
                    {
                      visualDie
                    }
                  </div>
                </div>
              )}

              {animation.phase ===
                "result" && (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 1.18,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    type:
                      "spring",
                    stiffness:
                      175,
                    damping:
                      17,
                  }}
                  className="absolute inset-0 z-[230] flex items-center justify-center px-6"
                >
                  <div className="arena-result-wrap">
                    <div className="arena-result-label">
                      RESULTADO
                    </div>

                    <div
                      className="arena-result-number"
                      data-value={
                        roll.total
                      }
                    >
                      {
                        roll.total
                      }
                    </div>

                    <div className="arena-result-expression">
                      {
                        roll.expression
                      }
                    </div>

                    <div className="arena-result-visual-note">
                      D
                      {
                        roll.sides
                      }
                      {" "}
                      calculado
                      {" · "}
                      D
                      {
                        visualDie
                      }
                      {" "}
                      visual
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
      </AnimatePresence>
    </>
  )
}

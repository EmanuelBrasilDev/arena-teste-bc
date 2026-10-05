import DiceBox from "@3d-dice/dice-box"

import {
  useEffect,
  useRef,
  useState,
} from "react"

import {
  getDiceThemeColor,
  getVisualNotation,
} from "@/lib/dice-visual"

import type {
  DiceRollResult,
  DiceVisualStyle,
} from "@/types/arena"

type DiceBoxStageProps = {
  roll: DiceRollResult | null
  style: DiceVisualStyle
  active: boolean
  onSettled:
    (rollId: string) => void
}

export function DiceBoxStage({
  roll,
  style,
  active,
  onSettled,
}: DiceBoxStageProps) {
  const diceBoxRef =
    useRef<DiceBox | null>(
      null,
    )

  const lastRollRef =
    useRef<string | null>(
      null,
    )

  const onSettledRef =
    useRef(onSettled)

  const [ready, setReady] =
    useState(false)

  useEffect(() => {
    onSettledRef.current =
      onSettled
  }, [onSettled])

  useEffect(() => {
    let cancelled =
      false

    async function setup() {
      try {
        const diceBox =
          new DiceBox({
            container:
              "#arena-dice-box",

            assetPath:
              "/assets/dice-box/",

            theme:
              "default",

            themeColor:
              "#e4e4e7",

            scale: 7,

            gravity: 1.5,

            mass: 1,

            friction: 0.72,

            restitution:
              0.22,

            angularDamping:
              0.48,

            linearDamping:
              0.46,

            spinForce: 7,

            throwForce: 7,

            startingHeight:
              8,

            settleTimeout:
              4200,

            delay: 20,

            lightIntensity:
              1.35,

            enableShadows:
              true,

            shadowTransparency:
              0.65,

            /*
             * Mais estável durante
             * desenvolvimento Vite.
             */
            /*
             * Mantemos o canvas principal por compatibilidade
             * e estabilidade com Vite/Codespaces.
             */
            offscreen:
              false,
          })

        await diceBox.init()

        if (cancelled) {
          diceBox.clear()
          return
        }

        diceBoxRef.current =
          diceBox

        setReady(true)
      } catch (error) {
        console.error(
          "Erro ao iniciar DiceBox:",
          error,
        )
      }
    }

    void setup()

    return () => {
      cancelled = true

      diceBoxRef.current?.clear()

      diceBoxRef.current =
        null
    }
  }, [])

  useEffect(() => {
    if (
      !ready ||
      !active ||
      !roll ||
      !diceBoxRef.current
    ) {
      return
    }

    /*
     * A partir daqui a rolagem já foi validada.
     * Guardamos em uma constante para que o TypeScript
     * preserve o tipo não-nulo também dentro das funções
     * assíncronas criadas abaixo.
     */
    const currentRoll = roll

    if (
      lastRollRef.current ===
      currentRoll.id
    ) {
      return
    }

    lastRollRef.current =
      currentRoll.id

    const box =
      diceBoxRef.current

    const {
      notation,
    } =
      getVisualNotation(
        currentRoll.quantity,
        currentRoll.sides,
      )

    box.clear()

    box.updateConfig({
      theme:
        "default",

      themeColor:
        getDiceThemeColor(
          style,
        ),

      scale:
        roll.quantity >= 4
          ? 5.2
          : roll.quantity >= 2
            ? 6
            : 7.2,
    })

    let completed =
      false

    async function play() {
      try {
        await box.roll(
          notation,
        )

        if (completed) {
          return
        }

        completed = true

        onSettledRef.current(
          currentRoll.id,
        )
      } catch (error) {
        console.error(
          "Erro na animação 3D:",
          error,
        )

        if (!completed) {
          completed = true

          onSettledRef.current(
            currentRoll.id,
          )
        }
      }
    }

    void play()

    const fallback =
      window.setTimeout(
        () => {
          if (completed) {
            return
          }

          completed = true

          onSettledRef.current(
            currentRoll.id,
          )
        },
        4700,
      )

    return () => {
      window.clearTimeout(
        fallback,
      )
    }
  }, [
    active,
    ready,
    roll,
    style,
  ])

  return (
    <div
      id="arena-dice-box"
      className={[
        "absolute inset-0",
        active
          ? "opacity-100"
          : "pointer-events-none opacity-0",
      ].join(" ")}
    />
  )
}

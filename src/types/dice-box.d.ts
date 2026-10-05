declare module "@3d-dice/dice-box" {
  export type DiceBoxConfig = {
    container?: string
    assetPath: string
    gravity?: number
    mass?: number
    friction?: number
    restitution?: number
    angularDamping?: number
    linearDamping?: number
    spinForce?: number
    throwForce?: number
    startingHeight?: number
    settleTimeout?: number
    offscreen?: boolean
    delay?: number
    lightIntensity?: number
    enableShadows?: boolean
    shadowTransparency?: number
    theme?: string
    themeColor?: string
    scale?: number
    origin?: string
  }

  export default class DiceBox {
    constructor(config: DiceBoxConfig)

    init(): Promise<void>

    roll(
      notation: string,
      options?: {
        theme?: string
        newStartPoint?: boolean
      },
    ): Promise<unknown>

    clear(): void

    updateConfig(
      config: Partial<DiceBoxConfig>,
    ): void

    show(className?: string): void

    hide(className?: string): void
  }
}

export type DiceEffect =
  | "none"
  | "fire"
  | "ice"
  | "electric"
  | "poison"
  | "arcane"

export type DiceVisualStyle =
  | "classic"
  | "obsidian"
  | "arcane"
  | "tech"

export type DiceRollResult = {
  id: string
  expression: string
  quantity: number
  sides: number
  rolls: number[]
  modifier: number
  total: number
}

export type ChatMessage = {
  id: string
  author: string
  content: string
  createdAt: string
  rolls: DiceRollResult[]
}

export type RollAnimationPhase =
  | "rolling"
  | "result"

export type RollAnimationItem = {
  roll: DiceRollResult
  effect: DiceEffect
  style: DiceVisualStyle
}

export type RollAnimationState = {
  visible: boolean
  phase: RollAnimationPhase
  roll: DiceRollResult | null
  effect: DiceEffect
  style: DiceVisualStyle
}

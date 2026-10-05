export type SubstatusKind =
  | "buff"
  | "debuff"

export type CharacterSubstatus = {
  id: string

  name: string
  kind: SubstatusKind

  /*
   * Campos livres.
   *
   * Exemplos:
   * quantity = "5d3"
   * quantity = "+20%"
   * duration = "3c"
   * duration = "2 turnos"
   */
  quantity: string
  duration: string
}

export type CharacterSubstatusSheet = {
  id: string
  characterName: string

  statuses: CharacterSubstatus[]
}

export type PartialResistanceResult = {
  debuffChance: number
  resistance: number
  finalChance: number

  roll: number

  success: boolean
}

export type IntegralResistanceResult = {
  attackerExpression: string
  defenderExpression: string

  attackerTotal: number
  defenderTotal: number

  winner:
    | "attacker"
    | "defender"
    | "draw"
}

import type {
  DiceVisualStyle,
} from "@/types/arena"

export type StandardVisualDie =
  | 4
  | 6
  | 8
  | 10
  | 12
  | 20
  | 100

export function getVisualDie(
  requestedSides: number,
): StandardVisualDie {
  /*
   * O dado visual é REPRESENTATIVO.
   *
   * Exemplo:
   * d3  -> D6 visual
   * d50 -> D100 visual
   *
   * O resultado oficial sempre vem
   * do nosso motor matemático.
   */

  if (requestedSides <= 3) {
    return 6
  }

  if (requestedSides === 4) {
    return 4
  }

  if (requestedSides <= 6) {
    return 6
  }

  if (requestedSides <= 8) {
    return 8
  }

  if (requestedSides <= 10) {
    return 10
  }

  if (requestedSides <= 12) {
    return 12
  }

  if (requestedSides <= 20) {
    return 20
  }

  return 100
}

export function getVisualNotation(
  quantity: number,
  requestedSides: number,
) {
  /*
   * Evita tentar renderizar 100 dados
   * físicos de uma só vez.
   *
   * A matemática continua usando todos.
   */
  /*
   * A rolagem matemática mantém TODOS os dados.
   *
   * Para a animação, até 4 modelos físicos já comunicam
   * visualmente uma rolagem múltipla sem sobrecarregar
   * física, sombras e renderização.
   */
  const visualQuantity =
    Math.min(
      Math.max(quantity, 1),
      4,
    )

  const visualSides =
    getVisualDie(requestedSides)

  return {
    visualQuantity,
    visualSides,
    notation:
      `${visualQuantity}d${visualSides}`,
  }
}

export function getDiceThemeColor(
  style: DiceVisualStyle,
) {
  switch (style) {
    case "classic":
      return "#e4e4e7"

    case "obsidian":
      return "#18181b"

    case "arcane":
      return "#7c3aed"

    case "tech":
      return "#0891b2"

    default:
      return "#e4e4e7"
  }
}

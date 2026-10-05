import type { DiceRollResult } from "@/types/arena"

const MAX_DICE = 100
const MAX_SIDES = 1_000_000

function createId() {
  return crypto.randomUUID()
}

function secureRandomInt(min: number, max: number) {
  const range = max - min + 1

  if (range <= 0 || range > 0xffffffff) {
    throw new Error("Intervalo de aleatoriedade inválido.")
  }

  const maxUint32 = 0x100000000
  const limit = maxUint32 - (maxUint32 % range)

  const buffer = new Uint32Array(1)

  let value = 0

  do {
    crypto.getRandomValues(buffer)
    value = buffer[0]
  } while (value >= limit)

  return min + (value % range)
}

export function rollDiceExpression(expression: string): DiceRollResult {
  const normalized = expression
    .trim()
    .replace(/\s+/g, "")
    .toLowerCase()

  const match = normalized.match(/^(\d*)d(\d+)([+-]\d+)?$/)

  if (!match) {
    throw new Error(`Expressão inválida: ${expression}`)
  }

  const quantity = match[1] ? Number(match[1]) : 1
  const sides = Number(match[2])
  const modifier = match[3] ? Number(match[3]) : 0

  if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > MAX_DICE) {
    throw new Error(`A quantidade deve estar entre 1 e ${MAX_DICE}.`)
  }

  if (!Number.isSafeInteger(sides) || sides < 2 || sides > MAX_SIDES) {
    throw new Error(`O dado deve possuir entre 2 e ${MAX_SIDES} lados.`)
  }

  const rolls = Array.from(
    { length: quantity },
    () => secureRandomInt(1, sides),
  )

  const total =
    rolls.reduce((sum, value) => sum + value, 0) +
    modifier

  return {
    id: createId(),
    expression: normalized,
    quantity,
    sides,
    rolls,
    modifier,
    total,
  }
}

export function extractDiceExpressions(text: string) {
  const expressionRegex = /\b\d*d\d+(?:[+-]\d+)?\b/gi

  return Array.from(
    text.matchAll(expressionRegex),
    (match) => match[0],
  )
}

export function rollAllExpressions(text: string) {
  return extractDiceExpressions(text).map((expression) =>
    rollDiceExpression(expression),
  )
}

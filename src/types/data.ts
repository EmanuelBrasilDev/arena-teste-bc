export type SheetBlockType =
  | "heading"
  | "field"
  | "entry"

export type SheetBlock = {
  id: string
  type: SheetBlockType

  /*
   * heading:
   *   title = "Itens"
   *
   * field:
   *   title = "Classe"
   *   value = "Melee"
   *
   * entry:
   *   title = "Impacto Aprimorado (Nv2 - 15 PM)"
   *   details = "Dano Adicional: +1d5."
   */
  title: string
  value: string
  details: string
}

export type CharacterSheet = {
  id: string

  name: string

  /*
   * URL externa para a imagem do personagem.
   * Opcional para manter compatibilidade com fichas
   * antigas já salvas no localStorage.
   */
  imageUrl?: string

  vtd: string
  pv: string
  pm: string

  blocks: SheetBlock[]
}

export type DataDivision = {
  id: string
  name: string
  sheets: CharacterSheet[]
}

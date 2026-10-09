export type MapTokenType =
  | "player"
  | "npc"

export type MapToken = {
  id: string

  /*
   * player:
   * imagem e nome vêm da ficha de Dados.
   *
   * npc:
   * nome e imagem podem ser definidos manualmente.
   */
  type?: MapTokenType

  name: string

  x: number
  y: number

  color: string

  /*
   * Usado somente para Player.
   */
  characterSheetId?: string

  /*
   * Usado somente para NPC / Token avulso.
   */
  imageUrl?: string
}

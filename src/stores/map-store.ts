import { create } from "zustand"
import { persist } from "zustand/middleware"

import type {
  MapToken,
} from "@/types/map"

export const MAP_GRID_SIZE = 10

type MapStore = {
  tokens: MapToken[]
  selectedTokenId: string | null

  backgroundImageUrl: string

  setBackgroundImageUrl: (
    url: string,
  ) => void

  addPlayerToken: (
    characterSheetId: string,
    name: string,
  ) => boolean

  addNpcToken: (
    name: string,
    imageUrl: string,
  ) => boolean

  removeToken: (
    tokenId: string,
  ) => void

  moveToken: (
    tokenId: string,
    x: number,
    y: number,
  ) => boolean

  selectToken: (
    tokenId: string | null,
  ) => void

  clearTokens: () => void
}

const TOKEN_COLORS = [
  "#8b5cf6",
  "#06b6d4",
  "#ef4444",
  "#22c55e",
  "#f59e0b",
  "#ec4899",
]

function createId() {
  return crypto.randomUUID()
}

function isCellOccupied(
  tokens: MapToken[],
  x: number,
  y: number,
  ignoredTokenId?: string,
) {
  return tokens.some(
    (token) =>
      token.id !== ignoredTokenId &&
      token.x === x &&
      token.y === y,
  )
}

function findFreeCell(
  tokens: MapToken[],
) {
  for (
    let y = 0;
    y < MAP_GRID_SIZE;
    y += 1
  ) {
    for (
      let x = 0;
      x < MAP_GRID_SIZE;
      x += 1
    ) {
      if (
        !isCellOccupied(
          tokens,
          x,
          y,
        )
      ) {
        return {
          x,
          y,
        }
      }
    }
  }

  return null
}

function makeTokenBase(
  tokens: MapToken[],
) {
  const freeCell =
    findFreeCell(tokens)

  if (!freeCell) {
    return null
  }

  return {
    id:
      createId(),

    x:
      freeCell.x,

    y:
      freeCell.y,

    color:
      TOKEN_COLORS[
        tokens.length %
          TOKEN_COLORS.length
      ],
  }
}

export const useMapStore =
  create<MapStore>()(
    persist(
      (set, get) => ({
        tokens: [],

        selectedTokenId:
          null,

        backgroundImageUrl:
          "",

        setBackgroundImageUrl:
          (url) => {
            set({
              backgroundImageUrl:
                url,
            })
          },

        addPlayerToken:
          (
            characterSheetId,
            name,
          ) => {
            const {
              tokens,
            } = get()

            /*
             * Impede duplicar o mesmo Player
             * no mesmo mapa.
             */
            const alreadyExists =
              tokens.some(
                (token) =>
                  token.type ===
                    "player" &&
                  token.characterSheetId ===
                    characterSheetId,
              )

            if (
              alreadyExists
            ) {
              return false
            }

            const base =
              makeTokenBase(
                tokens,
              )

            if (!base) {
              return false
            }

            const token:
              MapToken = {
              ...base,

              type:
                "player",

              name,

              characterSheetId,
            }

            set({
              tokens: [
                ...tokens,
                token,
              ],

              selectedTokenId:
                token.id,
            })

            return true
          },

        addNpcToken:
          (
            name,
            imageUrl,
          ) => {
            const cleanName =
              name.trim()

            if (!cleanName) {
              return false
            }

            const {
              tokens,
            } = get()

            const base =
              makeTokenBase(
                tokens,
              )

            if (!base) {
              return false
            }

            const token:
              MapToken = {
              ...base,

              type:
                "npc",

              name:
                cleanName,

              imageUrl:
                imageUrl.trim(),
            }

            set({
              tokens: [
                ...tokens,
                token,
              ],

              selectedTokenId:
                token.id,
            })

            return true
          },

        removeToken:
          (tokenId) => {
            set((state) => ({
              tokens:
                state.tokens.filter(
                  (token) =>
                    token.id !==
                    tokenId,
                ),

              selectedTokenId:
                state.selectedTokenId ===
                tokenId
                  ? null
                  : state.selectedTokenId,
            }))
          },

        moveToken:
          (
            tokenId,
            x,
            y,
          ) => {
            if (
              x < 0 ||
              y < 0 ||
              x >=
                MAP_GRID_SIZE ||
              y >=
                MAP_GRID_SIZE
            ) {
              return false
            }

            const {
              tokens,
            } = get()

            if (
              isCellOccupied(
                tokens,
                x,
                y,
                tokenId,
              )
            ) {
              return false
            }

            set({
              tokens:
                tokens.map(
                  (token) =>
                    token.id ===
                    tokenId
                      ? {
                          ...token,
                          x,
                          y,
                        }
                      : token,
                ),
            })

            return true
          },

        selectToken:
          (tokenId) => {
            set({
              selectedTokenId:
                tokenId,
            })
          },

        clearTokens:
          () => {
            set({
              tokens: [],
              selectedTokenId:
                null,
            })
          },
      }),

      {
        /*
         * Mantemos a mesma chave para preservar
         * Tokens já criados no protótipo.
         */
        name:
          "arena-teste-map-v1",
      },
    ),
  )

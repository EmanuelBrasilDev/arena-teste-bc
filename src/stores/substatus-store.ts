import { create } from "zustand"
import { persist } from "zustand/middleware"

import type {
  CharacterSubstatus,
  CharacterSubstatusSheet,
  SubstatusKind,
} from "@/types/substatus"

type SubstatusStore = {
  sheets:
    CharacterSubstatusSheet[]

  addCharacter:
    () => void

  removeCharacter:
    (
      sheetId: string,
    ) => void

  renameCharacter:
    (
      sheetId: string,
      name: string,
    ) => void

  addStatus:
    (
      sheetId: string,
      kind: SubstatusKind,
    ) => void

  updateStatus:
    (
      sheetId: string,
      statusId: string,
      patch:
        Partial<CharacterSubstatus>,
    ) => void

  removeStatus:
    (
      sheetId: string,
      statusId: string,
    ) => void
}

function id() {
  return crypto.randomUUID()
}

function createStatus(
  kind: SubstatusKind,
): CharacterSubstatus {
  return {
    id: id(),

    name:
      kind === "buff"
        ? "Novo Buff"
        : "Novo Debuff",

    kind,

    quantity: "",
    duration: "",
  }
}

const initialSheets:
  CharacterSubstatusSheet[] = [
    {
      id:
        "rein-zenbolt-substatus",

      characterName:
        "Rein Zenbolt",

      statuses: [
        {
          id:
            "rein-burning",

          name:
            "Queimação",

          kind:
            "debuff",

          quantity:
            "5d3",

          duration:
            "3c",
        },
      ],
    },
  ]

export const useSubstatusStore =
  create<SubstatusStore>()(
    persist(
      (set) => ({
        sheets:
          initialSheets,

        addCharacter:
          () => {
            set((state) => ({
              sheets: [
                ...state.sheets,

                {
                  id: id(),

                  characterName:
                    "Novo Personagem",

                  statuses: [],
                },
              ],
            }))
          },

        removeCharacter:
          (sheetId) => {
            set((state) => ({
              sheets:
                state.sheets.filter(
                  (sheet) =>
                    sheet.id !==
                    sheetId,
                ),
            }))
          },

        renameCharacter:
          (
            sheetId,
            name,
          ) => {
            set((state) => ({
              sheets:
                state.sheets.map(
                  (sheet) =>
                    sheet.id ===
                    sheetId
                      ? {
                          ...sheet,
                          characterName:
                            name,
                        }
                      : sheet,
                ),
            }))
          },

        addStatus:
          (
            sheetId,
            kind,
          ) => {
            set((state) => ({
              sheets:
                state.sheets.map(
                  (sheet) =>
                    sheet.id ===
                    sheetId
                      ? {
                          ...sheet,

                          statuses: [
                            ...sheet.statuses,
                            createStatus(
                              kind,
                            ),
                          ],
                        }
                      : sheet,
                ),
            }))
          },

        updateStatus:
          (
            sheetId,
            statusId,
            patch,
          ) => {
            set((state) => ({
              sheets:
                state.sheets.map(
                  (sheet) =>
                    sheet.id ===
                    sheetId
                      ? {
                          ...sheet,

                          statuses:
                            sheet.statuses.map(
                              (status) =>
                                status.id ===
                                statusId
                                  ? {
                                      ...status,
                                      ...patch,
                                    }
                                  : status,
                            ),
                        }
                      : sheet,
                ),
            }))
          },

        removeStatus:
          (
            sheetId,
            statusId,
          ) => {
            set((state) => ({
              sheets:
                state.sheets.map(
                  (sheet) =>
                    sheet.id ===
                    sheetId
                      ? {
                          ...sheet,

                          statuses:
                            sheet.statuses.filter(
                              (status) =>
                                status.id !==
                                statusId,
                            ),
                        }
                      : sheet,
                ),
            }))
          },
      }),

      {
        name:
          "arena-teste-substatus-v1",
      },
    ),
  )

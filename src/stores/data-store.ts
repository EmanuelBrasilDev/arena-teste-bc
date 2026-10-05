import { create } from "zustand"
import { persist } from "zustand/middleware"

import type {
  CharacterSheet,
  DataDivision,
  SheetBlock,
  SheetBlockType,
} from "@/types/data"

type BaseSheetField =
  | "name"
  | "imageUrl"
  | "vtd"
  | "pv"
  | "pm"

type DataStore = {
  divisions: DataDivision[]

  addDivision: (name: string) => void
  renameDivision: (
    divisionId: string,
    name: string,
  ) => void
  removeDivision: (
    divisionId: string,
  ) => void

  addSheet: (
    divisionId: string,
  ) => void
  duplicateSheet: (
    divisionId: string,
    sheetId: string,
  ) => void
  removeSheet: (
    divisionId: string,
    sheetId: string,
  ) => void

  updateBaseField: (
    divisionId: string,
    sheetId: string,
    field: BaseSheetField,
    value: string,
  ) => void

  addBlock: (
    divisionId: string,
    sheetId: string,
    type: SheetBlockType,
  ) => void

  updateBlock: (
    divisionId: string,
    sheetId: string,
    blockId: string,
    patch: Partial<SheetBlock>,
  ) => void

  removeBlock: (
    divisionId: string,
    sheetId: string,
    blockId: string,
  ) => void

  moveBlock: (
    divisionId: string,
    sheetId: string,
    blockId: string,
    direction: "up" | "down",
  ) => void
}

function id() {
  return crypto.randomUUID()
}

function createEmptySheet(): CharacterSheet {
  return {
    id: id(),

    name: "Novo Personagem",
    imageUrl: "",
    vtd: "0",
    pv: "100",
    pm: "100",

    blocks: [],
  }
}

function createBlock(
  type: SheetBlockType,
): SheetBlock {
  if (type === "heading") {
    return {
      id: id(),
      type,
      title: "Novo Título",
      value: "",
      details: "",
    }
  }

  if (type === "field") {
    return {
      id: id(),
      type,
      title: "Campo",
      value: "Valor",
      details: "",
    }
  }

  return {
    id: id(),
    type,
    title: "Nova Opção",
    value: "",
    details: "Descrição da opção.",
  }
}

function cloneSheet(
  sheet: CharacterSheet,
): CharacterSheet {
  return {
    ...sheet,

    id: id(),

    name:
      `${sheet.name} - Cópia`,

    blocks:
      sheet.blocks.map(
        (block) => ({
          ...block,
          id: id(),
        }),
      ),
  }
}

const initialData: DataDivision[] = [
  {
    id: "division-allies",
    name: "Aliados",

    sheets: [
      {
        id: "zeo-example",

        name: "Zeo Reinbolt",
        imageUrl: "",
        vtd: "???",
        pv: "505",
        pm: "505",

        blocks: [
          {
            id: "zeo-items",
            type: "heading",
            title: "Itens",
            value: "",
            details: "",
          },

          {
            id: "zeo-talisman",
            type: "entry",
            title: "Talismã",
            value: "",
            details:
              "Refinamento de 5%",
          },

          {
            id: "zeo-necklace",
            type: "entry",
            title: "Colar",
            value: "",
            details:
              "+8% do PM total",
          },

          {
            id: "zeo-class",
            type: "field",
            title: "Classe",
            value: "Melee",
            details: "",
          },

          {
            id: "zeo-impact",
            type: "entry",
            title:
              "Impacto Aprimorado (Nv2 - 15 PM)",
            value: "",
            details:
              "Dano Adicional: +1d5.",
          },

          {
            id: "zeo-combat-body",
            type: "entry",
            title:
              "Corpo de Combate (Nv2 - 16 PM)",
            value: "",
            details:
              "Sucesso: Reduz 15% + 1d20% do dano.\nFalha: Mitiga apenas 1d15% do dano.",
          },

          {
            id: "zeo-pressure",
            type: "entry",
            title:
              "Passos de Pressão (Nv2 - 18 PM)",
            value: "",
            details:
              "Deslocamento adicional: +1 Bloco\nReflexos: 1d4",
          },

          {
            id: "zeo-guard",
            type: "entry",
            title:
              "Ruptura de Guarda (Nv1 - 10 PM)",
            value: "",
            details:
              "Ímpeto: 1d2\nIgnora 1d10% da redução de dano do alvo.",
          },

          {
            id: "zeo-vanguard",
            type: "entry",
            title:
              "Assalto de Vanguarda (Nv1 - 20 PM)",
            value: "",
            details:
              "Duração: 2 turnos\nCooldown: 4 turnos\nÍmpeto: 1d2 / Reflexo: 1d2",
          },

          {
            id: "zeo-grimoire",
            type: "heading",
            title:
              "Grimório: Ankurai Mahō (3 Trevos)",
            value: "",
            details: "",
          },

          {
            id: "zeo-basic",
            type: "heading",
            title: "Básicas",
            value: "",
            details: "",
          },

          {
            id: "zeo-black-emperor",
            type: "entry",
            title: "Black Emperor (0)",
            value: "",
            details: "",
          },

          {
            id: "zeo-kinetic",
            type: "entry",
            title: "Kinetic Energy (0)",
            value: "",
            details: "",
          },

          {
            id: "zeo-currents",
            type: "entry",
            title: "Battle Currents (0)",
            value: "",
            details: "",
          },

          {
            id: "zeo-rays",
            type: "entry",
            title: "Dark Gamma Rays (0)",
            value: "",
            details: "",
          },

          {
            id: "zeo-common",
            type: "heading",
            title: "Comuns",
            value: "",
            details: "",
          },

          {
            id: "zeo-energy-in",
            type: "entry",
            title: "Energy-in (0)",
            value: "",
            details: "",
          },

          {
            id: "zeo-invisible",
            type: "entry",
            title: "Invisible Energy (0)",
            value: "",
            details: "",
          },
        ],
      },
    ],
  },

  {
    id: "division-enemies",
    name: "Inimigos",
    sheets: [],
  },
]

export const useDataStore =
  create<DataStore>()(
    persist(
      (set) => ({
        divisions:
          initialData,

        addDivision:
          (name) => {
            const clean =
              name.trim()

            if (!clean) {
              return
            }

            set((state) => ({
              divisions: [
                ...state.divisions,

                {
                  id: id(),
                  name: clean,
                  sheets: [],
                },
              ],
            }))
          },

        renameDivision:
          (
            divisionId,
            name,
          ) => {
            set((state) => ({
              divisions:
                state.divisions.map(
                  (division) =>
                    division.id ===
                    divisionId
                      ? {
                          ...division,
                          name,
                        }
                      : division,
                ),
            }))
          },

        removeDivision:
          (divisionId) => {
            set((state) => ({
              divisions:
                state.divisions.filter(
                  (division) =>
                    division.id !==
                    divisionId,
                ),
            }))
          },

        addSheet:
          (divisionId) => {
            set((state) => ({
              divisions:
                state.divisions.map(
                  (division) =>
                    division.id ===
                    divisionId
                      ? {
                          ...division,

                          sheets: [
                            ...division.sheets,
                            createEmptySheet(),
                          ],
                        }
                      : division,
                ),
            }))
          },

        duplicateSheet:
          (
            divisionId,
            sheetId,
          ) => {
            set((state) => ({
              divisions:
                state.divisions.map(
                  (division) => {
                    if (
                      division.id !==
                      divisionId
                    ) {
                      return division
                    }

                    const sheet =
                      division.sheets.find(
                        (item) =>
                          item.id ===
                          sheetId,
                      )

                    if (!sheet) {
                      return division
                    }

                    return {
                      ...division,

                      sheets: [
                        ...division.sheets,
                        cloneSheet(
                          sheet,
                        ),
                      ],
                    }
                  },
                ),
            }))
          },

        removeSheet:
          (
            divisionId,
            sheetId,
          ) => {
            set((state) => ({
              divisions:
                state.divisions.map(
                  (division) =>
                    division.id ===
                    divisionId
                      ? {
                          ...division,

                          sheets:
                            division.sheets.filter(
                              (sheet) =>
                                sheet.id !==
                                sheetId,
                            ),
                        }
                      : division,
                ),
            }))
          },

        updateBaseField:
          (
            divisionId,
            sheetId,
            field,
            value,
          ) => {
            set((state) => ({
              divisions:
                state.divisions.map(
                  (division) =>
                    division.id ===
                    divisionId
                      ? {
                          ...division,

                          sheets:
                            division.sheets.map(
                              (sheet) =>
                                sheet.id ===
                                sheetId
                                  ? {
                                      ...sheet,
                                      [field]:
                                        value,
                                    }
                                  : sheet,
                            ),
                        }
                      : division,
                ),
            }))
          },

        addBlock:
          (
            divisionId,
            sheetId,
            type,
          ) => {
            set((state) => ({
              divisions:
                state.divisions.map(
                  (division) =>
                    division.id ===
                    divisionId
                      ? {
                          ...division,

                          sheets:
                            division.sheets.map(
                              (sheet) =>
                                sheet.id ===
                                sheetId
                                  ? {
                                      ...sheet,

                                      blocks: [
                                        ...sheet.blocks,
                                        createBlock(
                                          type,
                                        ),
                                      ],
                                    }
                                  : sheet,
                            ),
                        }
                      : division,
                ),
            }))
          },

        updateBlock:
          (
            divisionId,
            sheetId,
            blockId,
            patch,
          ) => {
            set((state) => ({
              divisions:
                state.divisions.map(
                  (division) =>
                    division.id ===
                    divisionId
                      ? {
                          ...division,

                          sheets:
                            division.sheets.map(
                              (sheet) =>
                                sheet.id ===
                                sheetId
                                  ? {
                                      ...sheet,

                                      blocks:
                                        sheet.blocks.map(
                                          (block) =>
                                            block.id ===
                                            blockId
                                              ? {
                                                  ...block,
                                                  ...patch,
                                                }
                                              : block,
                                        ),
                                    }
                                  : sheet,
                            ),
                        }
                      : division,
                ),
            }))
          },

        removeBlock:
          (
            divisionId,
            sheetId,
            blockId,
          ) => {
            set((state) => ({
              divisions:
                state.divisions.map(
                  (division) =>
                    division.id ===
                    divisionId
                      ? {
                          ...division,

                          sheets:
                            division.sheets.map(
                              (sheet) =>
                                sheet.id ===
                                sheetId
                                  ? {
                                      ...sheet,

                                      blocks:
                                        sheet.blocks.filter(
                                          (block) =>
                                            block.id !==
                                            blockId,
                                        ),
                                    }
                                  : sheet,
                            ),
                        }
                      : division,
                ),
            }))
          },

        moveBlock:
          (
            divisionId,
            sheetId,
            blockId,
            direction,
          ) => {
            set((state) => ({
              divisions:
                state.divisions.map(
                  (division) => {
                    if (
                      division.id !==
                      divisionId
                    ) {
                      return division
                    }

                    return {
                      ...division,

                      sheets:
                        division.sheets.map(
                          (sheet) => {
                            if (
                              sheet.id !==
                              sheetId
                            ) {
                              return sheet
                            }

                            const blocks =
                              [
                                ...sheet.blocks,
                              ]

                            const index =
                              blocks.findIndex(
                                (block) =>
                                  block.id ===
                                  blockId,
                              )

                            if (
                              index === -1
                            ) {
                              return sheet
                            }

                            const target =
                              direction ===
                              "up"
                                ? index - 1
                                : index + 1

                            if (
                              target < 0 ||
                              target >=
                                blocks.length
                            ) {
                              return sheet
                            }

                            const current =
                              blocks[index]

                            blocks[index] =
                              blocks[target]

                            blocks[target] =
                              current

                            return {
                              ...sheet,
                              blocks,
                            }
                          },
                        ),
                    }
                  },
                ),
            }))
          },
      }),

      {
        name:
          "arena-teste-dados-v1",
      },
    ),
  )

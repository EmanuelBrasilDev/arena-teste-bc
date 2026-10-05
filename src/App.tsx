import { Activity, Database, Swords } from "lucide-react"
import { useState } from "react"

import { ArenaTab } from "@/components/arena/ArenaTab"
import { SubstatusTab } from "@/components/substatus/SubstatusTab"
import { DataTab } from "@/components/data/DataTab"
import { RollAnimationOverlay } from "@/components/arena/RollAnimationOverlay"

type MainTab = "arena" | "dados" | "substatus"

const tabs = [
  {
    id: "arena" as const,
    label: "Arena",
    icon: Swords,
  },
  {
    id: "dados" as const,
    label: "Dados",
    icon: Database,
  },
  {
    id: "substatus" as const,
    label: "Substatus",
    icon: Activity,
  },
]

function App() {
  const [activeTab, setActiveTab] =
    useState<MainTab>("arena")

  return (
    <main className="min-h-screen bg-[#07070a] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.10),transparent_35%)]" />

      <div className="relative mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">

        <header className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
              Arena Teste
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Central de Batalha
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              Rolagens, comandos e gerenciamento manual da batalha.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            Ambiente local
          </div>
        </header>

        <nav className="mb-8">
          <div className="inline-flex w-full gap-1 rounded-2xl border border-white/10 bg-zinc-950/90 p-1.5 shadow-2xl shadow-black/30 md:w-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={[
                    "relative flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-all duration-200 md:min-w-40",
                    isActive
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-950/40"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white",
                  ].join(" ")}
                >
                  <Icon
                    className={[
                      "size-4 transition-colors",
                      isActive
                        ? "text-white"
                        : "text-zinc-500",
                    ].join(" ")}
                  />

                  <span>{tab.label}</span>

                  {isActive && (
                    <span className="absolute inset-x-6 -bottom-1 h-px bg-violet-300/70" />
                  )}
                </button>
              )
            })}
          </div>
        </nav>

        <div>
          {activeTab === "arena" && <ArenaTab />}

          {activeTab === "dados" && (
            <DataTab />
          )}

          {activeTab === "substatus" && (
            <SubstatusTab />
          )}
        </div>
      </div>
          <RollAnimationOverlay />
    </main>
  )
}

export default App

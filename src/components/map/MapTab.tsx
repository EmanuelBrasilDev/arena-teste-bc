import {
  Map as MapIcon,
} from "lucide-react"

import {
  BattleMap,
} from "@/components/map/BattleMap"

export function MapTab() {
  return (
    <div className="min-h-[650px]">
      <div className="mb-7 border-b border-white/10 pb-6">

        <div className="flex items-center gap-2">
          <MapIcon className="size-5 text-violet-400" />

          <h2 className="text-lg font-semibold text-white">
            Mapa
          </h2>
        </div>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
          Campo tático top-down para posicionar e movimentar personagens durante o combate.
        </p>
      </div>

      <BattleMap />

      <div className="mt-10 border-t border-white/[0.06] pt-4 text-[10px] uppercase tracking-[0.17em] text-zinc-700">
        Grid 10×10 • Movimentação manual • Estado salvo localmente
      </div>
    </div>
  )
}

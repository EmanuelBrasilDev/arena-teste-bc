import type {
  SheetBlock,
} from "@/types/data"

type SheetBlockViewProps = {
  block: SheetBlock
}

export function SheetBlockView({
  block,
}: SheetBlockViewProps) {
  if (block.type === "heading") {
    return (
      <div className="pt-3">
        <div className="flex items-center gap-3">
          <span className="h-[6px] w-[6px] rotate-45 rounded-[1px] bg-violet-300 shadow-[0_0_10px_rgba(196,181,253,0.85)]" />

          <h4 className="shrink-0 text-[11px] font-bold uppercase tracking-[0.24em] text-violet-200">
            {block.title ||
              "Título"}
          </h4>

          <div className="h-px flex-1 bg-gradient-to-r from-violet-300/35 via-violet-400/10 to-transparent" />
        </div>
      </div>
    )
  }

  if (block.type === "field") {
    return (
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 rounded-lg border border-violet-400/10 bg-violet-400/[0.045] px-3 py-2.5 text-sm">
        <span className="font-semibold text-violet-100/85">
          {block.title ||
            "Campo"}
          :
        </span>

        <span className="font-semibold text-white">
          {block.value ||
            "—"}
        </span>
      </div>
    )
  }

  const lines =
    block.details
      .split("\n")
      .map(
        (line) =>
          line.trim(),
      )
      .filter(Boolean)

  return (
    <div className="group/entry relative rounded-xl border border-violet-400/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015))] px-4 py-3 shadow-[0_12px_30px_-24px_rgba(139,92,246,0.85)] transition-colors hover:border-violet-300/18 hover:bg-violet-400/[0.06]">
      <div className="absolute bottom-3 left-0 top-3 w-[2px] rounded-full bg-gradient-to-b from-violet-300 via-violet-400/55 to-transparent" />

      <div className="flex gap-2.5 text-sm font-semibold leading-6 text-white">
        <span className="mt-[1px] shrink-0 font-mono text-violet-300">
          *
        </span>

        <span className="break-words">
          {block.title ||
            "Opção"}
        </span>
      </div>

      {lines.length > 0 && (
        <div className="mt-2 space-y-1.5">
          {lines.map(
            (
              line,
              index,
            ) => (
              <div
                key={`${block.id}-${index}`}
                className="flex gap-2.5 text-sm leading-5 text-zinc-300"
              >
                <span className="shrink-0 font-mono text-violet-300/85">
                  &gt;
                </span>

                <span className="break-words">
                  {line}
                </span>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  )
}

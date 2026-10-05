import type {
  PropsWithChildren,
} from "react"

export function ExpandableSheetFrame({
  children,
}: PropsWithChildren) {
  return (
    <div className="group relative isolate min-h-[240px] overflow-hidden rounded-[24px] shadow-[0_30px_80px_-40px_rgba(76,29,149,0.9)]">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 size-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="sheet-bg-strong"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#171326"
            />
            <stop
              offset="42%"
              stopColor="#0e1020"
            />
            <stop
              offset="100%"
              stopColor="#090b16"
            />
          </linearGradient>

          <linearGradient
            id="sheet-border-strong"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#a78bfa"
              stopOpacity="0.95"
            />
            <stop
              offset="55%"
              stopColor="#4338ca"
              stopOpacity="0.28"
            />
            <stop
              offset="100%"
              stopColor="#7c3aed"
              stopOpacity="0.88"
            />
          </linearGradient>
        </defs>

        <rect
          x="0.7"
          y="0.7"
          width="98.6"
          height="98.6"
          rx="3.2"
          fill="url(#sheet-bg-strong)"
          stroke="url(#sheet-border-strong)"
          strokeWidth="1.1"
          vectorEffect="non-scaling-stroke"
        />

        <rect
          x="1.8"
          y="1.8"
          width="96.4"
          height="96.4"
          rx="2.6"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.05"
          strokeWidth="0.9"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="pointer-events-none absolute inset-0 -z-[5] bg-[radial-gradient(circle_at_12%_8%,rgba(124,58,237,0.20),transparent_28%),radial-gradient(circle_at_88%_14%,rgba(59,130,246,0.16),transparent_26%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.10),transparent_34%)]" />

      <div className="pointer-events-none absolute inset-x-6 top-0 -z-[4] h-px bg-gradient-to-r from-transparent via-violet-300/40 to-transparent" />

      <div className="relative">
        {children}
      </div>
    </div>
  )
}

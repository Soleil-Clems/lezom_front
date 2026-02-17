"use client";

const SERVER_COLORS = [
  "#ED4245",
  "#3BA55C",
  "#FAA61A",
  "#5764f2",
  "#EB459E",
  "#9B59B6",
];

const CHANNEL_WIDTHS = [80, 65, 95, 55, 70, 85, 60];
const VOICE_WIDTHS = [70, 90, 55, 80];
const MEMBER_COLORS = ["#3BA55C", "#FAA61A", "#5764f2", "#ED4245", "#EB459E"];
const MEMBER_WIDTHS = [65, 80, 55, 75, 60];

const MESSAGES = [
  { color: "#ED4245", widths: [180, 240] },
  { color: "#5764f2", widths: [260, 160, 200] },
  { color: "#3BA55C", widths: [140] },
  { color: "#FAA61A", widths: [220, 180] },
  { color: "#EB459E", widths: [170, 250, 120] },
  { color: "#5764f2", widths: [200] },
  { color: "#3BA55C", widths: [240, 160] },
];

export function AuthBackground() {
  return (
    <div
      className="fixed inset-0 overflow-hidden select-none pointer-events-none"
      aria-hidden="true"
    >
      <div className="flex h-full w-full blur-[3px] opacity-20 scale-[1.02]">
        {/* Server icon bar */}
        <div className="w-[72px] bg-[#1E1F22] flex flex-col items-center pt-3 gap-2 shrink-0">
          <div className="h-12 w-12 rounded-2xl bg-[#5764f2]" />
          <div className="w-8 h-px bg-white/10 my-0.5" />
          {SERVER_COLORS.map((color, i) => (
            <div
              key={i}
              className="h-12 w-12 rounded-[24px]"
              style={{ backgroundColor: color }}
            />
          ))}
          <div className="h-12 w-12 rounded-[24px] bg-[#313338]" />
        </div>

        {/* Channel sidebar */}
        <div className="w-[240px] bg-[#2B2D31] hidden sm:flex flex-col shrink-0">
          <div className="h-12 px-4 flex items-center border-b border-black/30">
            <div className="h-4 w-32 rounded bg-white/15" />
          </div>
          <div className="flex flex-col py-3 px-2 gap-0.5">
            <div className="px-2 mb-2">
              <div className="h-2.5 w-24 rounded bg-white/8" />
            </div>
            {CHANNEL_WIDTHS.map((width, i) => (
              <div
                key={i}
                className={`h-8 px-2 rounded flex items-center gap-1.5 ${i === 0 ? "bg-white/10" : ""}`}
              >
                <span className="text-white/25 text-xs">#</span>
                <div
                  className={`h-2.5 rounded ${i === 0 ? "bg-white/20" : "bg-white/8"}`}
                  style={{ width }}
                />
              </div>
            ))}
            <div className="px-2 mt-4 mb-2">
              <div className="h-2.5 w-20 rounded bg-white/8" />
            </div>
            {VOICE_WIDTHS.map((width, i) => (
              <div
                key={`v-${i}`}
                className="h-8 px-2 rounded flex items-center gap-1.5"
              >
                <span className="text-white/25 text-xs">{"🔊"}</span>
                <div
                  className="h-2.5 rounded bg-white/8"
                  style={{ width }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 bg-[#313338] flex flex-col min-w-0">
          <div className="h-12 px-4 flex items-center border-b border-black/20 gap-2 shrink-0">
            <span className="text-white/25 text-sm">#</span>
            <div className="h-3.5 w-20 rounded bg-white/12" />
          </div>
          <div className="flex-1 flex flex-col justify-end pb-4 gap-4 overflow-hidden">
            {MESSAGES.map((msg, i) => (
              <div key={i} className="flex gap-3 px-4">
                <div
                  className="h-10 w-10 rounded-full shrink-0"
                  style={{ backgroundColor: msg.color }}
                />
                <div className="flex flex-col gap-1.5 pt-0.5">
                  <div className="h-3 w-20 rounded bg-white/18" />
                  {msg.widths.map((w, j) => (
                    <div
                      key={j}
                      className="h-2.5 rounded bg-white/8"
                      style={{ width: w }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mx-4 mb-4 h-11 rounded-lg bg-[#383A40] flex items-center px-4 shrink-0">
            <div className="h-3 w-44 rounded bg-white/8" />
          </div>
        </div>

        {/* Members sidebar */}
        <div className="w-[240px] bg-[#2B2D31] hidden lg:flex flex-col shrink-0">
          <div className="h-12 border-b border-black/20" />
          <div className="flex flex-col py-4 px-2 gap-0.5">
            <div className="px-2 mb-2">
              <div className="h-2.5 w-16 rounded bg-white/8" />
            </div>
            {MEMBER_COLORS.map((color, i) => (
              <div
                key={i}
                className="h-10 px-2 rounded flex items-center gap-2"
              >
                <div
                  className="h-8 w-8 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <div
                  className="h-2.5 rounded bg-white/10"
                  style={{ width: MEMBER_WIDTHS[i] }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vignette overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.8) 100%)",
        }}
      />
    </div>
  );
}

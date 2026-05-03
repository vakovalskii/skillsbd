import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "NeuralDeep — AI-инфраструктура on-prem в России";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0a0a0a",
          color: "#ededed",
          padding: "72px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* radial accent */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 50% 60% at 15% 30%, rgba(59,130,246,0.25), transparent 60%), radial-gradient(ellipse 40% 50% at 85% 80%, rgba(16,185,129,0.18), transparent 60%)",
            display: "flex",
          }}
        />

        {/* top tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "22px",
            fontFamily: "monospace",
            color: "#3b82f6",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#10b981",
            }}
          />
          AI-инженерия · on-prem · РФ
        </div>

        {/* main headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "92px",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            marginBottom: "24px",
          }}
        >
          <span style={{ display: "flex" }}>
            AI-инфраструктура{" "}
            <span style={{ color: "#3b82f6", marginLeft: "20px" }}>on-prem</span>
          </span>
          <span style={{ display: "flex" }}>в России</span>
        </div>

        {/* sub */}
        <div
          style={{
            display: "flex",
            fontSize: "30px",
            color: "#a1a1aa",
            maxWidth: "950px",
            lineHeight: 1.4,
            marginBottom: "auto",
          }}
        >
          Свои GPU, свои продукты, свой open source. И сделаем под вас.
        </div>

        {/* footer row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "48px",
            fontSize: "24px",
            fontFamily: "monospace",
          }}
        >
          <div style={{ color: "#3b82f6", display: "flex" }}>neuraldeep.ru</div>
          <div style={{ color: "#71717a", display: "flex", gap: "24px" }}>
            <span>5 продуктов в проде</span>
            <span style={{ color: "#3f3f46" }}>·</span>
            <span>1100+⭐ open source</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

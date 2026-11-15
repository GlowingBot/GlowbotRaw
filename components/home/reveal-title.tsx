import type { CSSProperties, ReactNode } from "react";

export const fontSans = "var(--font-geist), ui-sans-serif, sans-serif";
export const fontText = "var(--font-geist), sans-serif";
export const fontMono = "var(--font-geist-mono), monospace";
export const fontDisplay = "var(--font-anton), sans-serif";

export const sectionTitle: CSSProperties = {
  margin: 0,
  fontFamily: fontDisplay,
  fontWeight: 400,
  fontSize: "clamp(64px, 9vw, 160px)",
  lineHeight: 0.86,
  letterSpacing: "-0.01em",
  textTransform: "uppercase",
};

const hiddenLabel: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
};

export function RevealTitle({
  text,
  style,
  as = "h2",
  id,
  labelled = false,
}: {
  text: string;
  style?: CSSProperties;
  as?: "h1" | "h2";
  id?: string;
  labelled?: boolean;
}) {
  let index = 0;
  const letters: ReactNode[] = Array.from(text).map((char, key) => {
    if (char === " ") return " ";
    const start = index * 3;
    index += 1;
    return (
      <span
        key={key}
        className="ch"
        style={{ animationRange: `entry ${start}% entry ${start + 60}%` }}
      >
        {char}
      </span>
    );
  });

  const Heading = as;

  return (
    <Heading id={id} className="reveal" aria-label={labelled ? text : undefined} style={{ ...sectionTitle, ...style }}>
      <span aria-hidden="true">{letters}</span>
      {labelled ? null : <span style={hiddenLabel}>{text}</span>}
    </Heading>
  );
}

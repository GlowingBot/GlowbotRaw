import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { dataset, projectId } from "../../../sanity/env";
import { StudioLoader } from "./studio-loader";

export const metadata: Metadata = {
  referrer: "same-origin",
  robots: "noindex",
  title: "Studio · Guillermo López",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function StudioPage() {
  if (!projectId) {
    return (
      <main
        style={{
          boxSizing: "border-box",
          minHeight: "100dvh",
          padding: "48px 24px",
          fontFamily: "ui-sans-serif, sans-serif",
          lineHeight: 1.5,
        }}
      >
        <h1 style={{ fontSize: 32, margin: "0 0 16px" }}>Falta el project ID</h1>
        <p style={{ maxWidth: 560, margin: "0 0 16px" }}>
          Crea el archivo <code>.env.local</code> en la raíz del proyecto con estas dos líneas y
          reinicia <code>npm run dev</code>:
        </p>
        <pre
          style={{
            margin: 0,
            padding: 16,
            background: "#f4f4f1",
            borderRadius: 8,
            overflow: "auto",
          }}
        >
          {`NEXT_PUBLIC_SANITY_PROJECT_ID=tu-project-id\nNEXT_PUBLIC_SANITY_DATASET=${dataset}`}
        </pre>
      </main>
    );
  }

  return (
    <Suspense fallback={null}>
      <StudioLoader />
    </Suspense>
  );
}

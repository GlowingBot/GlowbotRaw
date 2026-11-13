"use client";

import { NextStudio } from "next-sanity/studio";
import { sanityConfig } from "../../../sanity.config";

export function Studio() {
  const config = sanityConfig();
  if (!config) return null;

  return (
    <div style={{ height: "100dvh" }}>
      <NextStudio config={config} />
    </div>
  );
}

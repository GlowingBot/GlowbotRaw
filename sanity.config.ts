import { defineConfig, type Config } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

export function sanityConfig(): Config | null {
  if (!projectId) return null;

  return defineConfig({
    name: "glowbot",
    title: "Guillermo López",
    basePath: "/studio",
    projectId,
    dataset,
    plugins: [structureTool({ structure })],
    schema: { types: schemaTypes },
    document: {
      singletons: ["siteSettings"],
      actions: (previous, context) =>
        context.schemaType === "siteSettings"
          ? previous.filter(({ action }) => action !== "delete" && action !== "duplicate")
          : previous,
    },
  });
}

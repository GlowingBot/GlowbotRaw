import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenido")
    .items([
      S.listItem()
        .title("Ajustes del sitio")
        .id("siteSettings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Ajustes del sitio"),
        ),
      S.divider(),
      S.listItem()
        .title("Proyectos")
        .schemaType("project")
        .child(
          S.documentTypeList("project")
            .title("Proyectos")
            .defaultOrdering([{ field: "order", direction: "asc" }]),
        ),
      S.listItem()
        .title("Servicios")
        .schemaType("service")
        .child(
          S.documentTypeList("service")
            .title("Servicios")
            .defaultOrdering([{ field: "number", direction: "asc" }]),
        ),
    ]);

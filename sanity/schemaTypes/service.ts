import { defineField, defineType } from "sanity";
import { imageWithAlt } from "./image";

export const service = defineType({
  name: "service",
  title: "Servicio",
  type: "document",
  orderings: [
    {
      title: "Número",
      name: "numberAsc",
      by: [{ field: "number", direction: "asc" }],
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "number",
      title: "Número",
      type: "string",
      description: "Ejemplo: 01",
      validation: (rule) => rule.required(),
    }),
    imageWithAlt({
      name: "peekImage",
      title: "Foto que sigue al cursor",
      description: "Aparece al pasar por la fila. También lleva hotspot.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "number",
      media: "peekImage",
    },
  },
});

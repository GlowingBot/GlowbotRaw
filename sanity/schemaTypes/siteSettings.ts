import { defineField, defineType } from "sanity";
import { imageWithAlt } from "./image";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Ajustes del sitio",
  type: "document",
  fields: [
    imageWithAlt({
      name: "heroImage",
      title: "Foto del hero",
      description: "El hotspot define el encuadre.",
    }),
    defineField({
      name: "heroTitle",
      title: "Título del hero",
      type: "object",
      description: "Dos líneas. Ninguna se parte.",
      fields: [
        defineField({
          name: "line1",
          title: "Línea 1",
          type: "string",
          description: "Ejemplo: El momento no vuelve.",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "line2",
          title: "Línea 2",
          type: "string",
          description: "Ejemplo: La foto se queda.",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "aboutText",
      title: "Texto de Sobre mí",
      type: "text",
      rows: 6,
      description: "Separa los párrafos con una línea en blanco.",
    }),
    imageWithAlt({
      name: "aboutPortrait",
      title: "Retrato",
      description: "El hotspot define el encuadre.",
    }),
    defineField({
      name: "email",
      title: "Correo",
      type: "string",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "instagram",
      title: "Instagram",
      type: "string",
      description: "Ejemplo: @glowbot.raw",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Ajustes del sitio" }),
  },
});

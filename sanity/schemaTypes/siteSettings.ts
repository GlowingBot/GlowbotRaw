import { defineField, defineType } from "sanity";
import { imageWithAlt } from "./image";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Ajustes del sitio",
  type: "document",
  fields: [
    imageWithAlt({
      name: "heroImage",
      title: "Foto del hero en web",
      description: "Horizontal. El hotspot define el encuadre.",
    }),
    imageWithAlt({
      name: "heroImageMobile",
      title: "Foto del hero en mobile",
      description: "Vertical, para cubrir la pantalla del teléfono. Si la dejas vacía, se usa la de web.",
      required: false,
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
    defineField({
      name: "base",
      title: "Base",
      type: "string",
      description: "Ejemplo: Ciudad de México",
    }),
    defineField({
      name: "disciplines",
      title: "Disciplinas",
      type: "string",
      description: "Deportes que fotografías. Ejemplo: MTB, BMX, skate y deporte urbano",
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

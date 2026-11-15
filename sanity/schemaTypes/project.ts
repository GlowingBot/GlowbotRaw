import { defineField, defineType } from "sanity";
import { galleryImageMember, imageWithAlt } from "./image";

export const project = defineType({
  name: "project",
  title: "Proyecto",
  type: "document",
  orderings: [
    {
      title: "Orden",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
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
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "discipline",
      title: "Disciplina",
      type: "string",
    }),
    defineField({
      name: "place",
      title: "Lugar",
      type: "string",
    }),
    defineField({
      name: "date",
      title: "Fecha",
      type: "string",
      description: "Mes y año, como se muestra en la ficha.",
    }),
    defineField({
      name: "camera",
      title: "Cámara",
      type: "string",
      description: "Ejemplo: Canon R5",
    }),
    defineField({
      name: "lenses",
      title: "Lentes",
      type: "string",
      description: "Ejemplo: 16-35mm f/2.8",
    }),
    defineField({
      name: "light",
      title: "Iluminación",
      type: "string",
      description: "Ejemplo: Godox AD200 fuera de cuadro",
    }),
    defineField({
      name: "riders",
      title: "Riders",
      type: "array",
      of: [{ type: "string" }],
      description: "Nombres, con su permiso.",
    }),
    defineField({
      name: "summary",
      title: "Resumen",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "stat",
      title: "Dato",
      type: "object",
      fields: [
        defineField({
          name: "number",
          title: "Número",
          type: "string",
          description: "Ejemplo: 6",
        }),
        defineField({
          name: "label",
          title: "Etiqueta",
          type: "text",
          rows: 2,
          description: "Ejemplo: atletas con más de 10 mil seguidores compartieron la serie",
        }),
      ],
    }),
    imageWithAlt({
      name: "cover",
      title: "Portada en web",
      description:
        "Horizontal o vertical. Arrastra el hotspot: ese punto es el encuadre de la tira.",
    }),
    imageWithAlt({
      name: "coverMobile",
      title: "Portada en mobile",
      description:
        "Vertical, para el teléfono. Si la dejas vacía, se usa la de web. El hotspot define el encuadre.",
      required: false,
    }),
    defineField({
      name: "gallery",
      title: "Galería",
      type: "array",
      of: [galleryImageMember()],
    }),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      description: "Posición en la tira. 1 es la primera foto.",
      validation: (rule) => rule.required().integer().positive(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "discipline",
      media: "cover",
    },
  },
});

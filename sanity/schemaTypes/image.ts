import { defineArrayMember, defineField, type FieldDefinition } from "sanity";

function altField() {
  return defineField({
    name: "alt",
    title: "Texto alternativo",
    type: "string",
    description: "Describe la foto para quien no puede verla.",
    validation: (rule) => rule.required().error("El texto alternativo es obligatorio."),
  });
}

function layoutField() {
  return defineField({
    name: "layout",
    title: "Disposición",
    type: "string",
    options: {
      list: [
        { title: "Ancho completo", value: "full" },
        { title: "7-5", value: "7-5" },
        { title: "5-7", value: "5-7" },
      ],
      layout: "radio",
    },
    initialValue: "full",
    validation: (rule) => rule.required(),
  });
}

type ImageFieldOptions = {
  name: string;
  title: string;
  description?: string;
  required?: boolean;
};

export function imageWithAlt({
  name,
  title,
  description,
  required = true,
}: ImageFieldOptions): FieldDefinition {
  return defineField({
    name,
    title,
    description,
    type: "image",
    options: { hotspot: true },
    fields: [altField()],
    validation: (rule) => (required ? rule.required().error("Sube una imagen.") : rule),
  });
}

export function galleryImageMember() {
  return defineArrayMember({
    type: "image",
    options: { hotspot: true },
    fields: [altField(), layoutField()],
  });
}

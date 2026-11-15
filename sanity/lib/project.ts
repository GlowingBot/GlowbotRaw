import { cacheLife, cacheTag } from "next/cache";
import { dataset, projectId } from "../env";
import { imageUrl } from "./image";

const API_VERSION = "2026-11-13";

const PROJECT_QUERY = `{
  "project": *[_type == "project" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    discipline,
    place,
    date,
    camera,
    lenses,
    light,
    riders,
    summary,
    stat{ number, label },
    gallery[]{
      alt,
      hotspot,
      layout,
      asset
    }
  },
  "projects": *[_type == "project" && defined(slug.current)]{
    title,
    "slug": slug.current,
    order
  }
}`;

type Hotspot = { x?: number; y?: number } | null;

type GalleryImage = {
  alt?: string | null;
  hotspot?: Hotspot;
  layout?: string | null;
  asset?: { _ref?: string } | null;
} | null;

type ProjectQuery = {
  project?: {
    title?: string | null;
    slug?: string | null;
    discipline?: string | null;
    place?: string | null;
    date?: string | null;
    camera?: string | null;
    lenses?: string | null;
    light?: string | null;
    riders?: Array<string | null> | null;
    summary?: string | null;
    stat?: { number?: string | null; label?: string | null } | null;
    gallery?: GalleryImage[] | null;
  } | null;
  projects?: Array<{
    title?: string | null;
    slug?: string | null;
    order?: number | null;
  }> | null;
};

export type ProjectPhoto = {
  src: string;
  alt: string;
  position: string;
  layout: "full" | "7-5" | "5-7";
};

export type ProjectPageData = {
  title: string;
  slug: string;
  discipline: string;
  place: string;
  date: string;
  camera: string;
  lenses: string;
  light: string;
  riders: string;
  summary: string;
  statNumber: string;
  statLabel: string;
  gallery: ProjectPhoto[];
  next: { title: string; href: string } | null;
};

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function position(hotspot: Hotspot | undefined): string {
  const x = typeof hotspot?.x === "number" && Number.isFinite(hotspot.x) ? hotspot.x : 0.5;
  const y = typeof hotspot?.y === "number" && Number.isFinite(hotspot.y) ? hotspot.y : 0.5;
  const clamp = (value: number) => Math.min(1, Math.max(0, value));
  return `${(clamp(x) * 100).toFixed(2)}% ${(clamp(y) * 100).toFixed(2)}%`;
}

function layoutOf(value: unknown): ProjectPhoto["layout"] {
  if (value === "7-5" || value === "5-7") return value;
  return "full";
}

function photo(image: GalleryImage): ProjectPhoto | null {
  if (!image?.asset?._ref) return null;
  const src = imageUrl(image, 3840);
  if (!src) return null;
  return {
    src,
    alt: text(image.alt),
    position: position(image.hotspot),
    layout: layoutOf(image.layout),
  };
}

function normalize(data: ProjectQuery | null, slug: string): ProjectPageData | null {
  const project = data?.project;
  if (!project || text(project.slug) !== slug) return null;

  const neighbors = (data?.projects ?? [])
    .map((item) => ({
      title: text(item.title),
      slug: text(item.slug),
      order: typeof item.order === "number" && Number.isFinite(item.order) ? item.order : Number.POSITIVE_INFINITY,
    }))
    .filter((item) => item.slug)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, "es"));

  const index = neighbors.findIndex((item) => item.slug === slug);
  const next = neighbors.length > 1 ? neighbors[(index + 1) % neighbors.length] : null;

  return {
    title: text(project.title),
    slug,
    discipline: text(project.discipline),
    place: text(project.place),
    date: text(project.date),
    camera: text(project.camera),
    lenses: text(project.lenses),
    light: text(project.light),
    riders: (project.riders ?? []).map((rider) => text(rider)).filter(Boolean).join(", "),
    summary: text(project.summary),
    statNumber: text(project.stat?.number),
    statLabel: text(project.stat?.label),
    gallery: (project.gallery ?? []).map((image) => photo(image)).filter((image) => image !== null),
    next: next ? { title: next.title || "Proyecto", href: `/proyectos/${encodeURIComponent(next.slug)}` } : null,
  };
}

async function queryProjects(slug: string): Promise<ProjectQuery | null> {
  const endpoint = new URL(
    `https://${projectId}.apicdn.sanity.io/v${API_VERSION}/data/query/${dataset}`,
  );
  endpoint.searchParams.set("query", PROJECT_QUERY);
  endpoint.searchParams.set("$slug", JSON.stringify(slug));
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`Sanity respondió ${response.status}`);
  const body = (await response.json()) as { result?: ProjectQuery | null };
  return body.result ?? null;
}

export async function getProjectPage(slug: string): Promise<ProjectPageData | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("home");

  if (!projectId || !slug) return null;

  try {
    return normalize(await queryProjects(slug), slug);
  } catch (error) {
    console.error("No se pudo leer el proyecto.", error);
    return null;
  }
}

export async function getProjectSlugs(): Promise<string[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("home");

  if (!projectId) return [];

  try {
    const data = await queryProjects("");
    return (data?.projects ?? []).map((item) => text(item.slug)).filter(Boolean);
  } catch (error) {
    console.error("No se pudieron listar los proyectos.", error);
    return [];
  }
}

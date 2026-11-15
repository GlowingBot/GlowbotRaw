import type { HomeContent, HomeImage, RibbonProject, ServiceItem } from "@/components/home/types";
import { cacheLife, cacheTag } from "next/cache";
import { dataset, projectId } from "../env";
import { imageUrl } from "./image";

const API_VERSION = "2026-11-13";

const HOME_QUERY = `{
  "settings": *[_type == "siteSettings"][0]{
    heroTitle,
    aboutText,
    base,
    disciplines,
    email,
    instagram,
    heroImage{
      alt,
      hotspot,
      asset,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    },
    aboutPortrait{
      alt,
      hotspot,
      asset,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    }
  },
  "projects": *[_type == "project"]{
    title,
    "slug": slug.current,
    discipline,
    date,
    order,
    cover{
      alt,
      hotspot,
      asset,
      "aspect": asset->metadata.dimensions.aspectRatio
    }
  },
  "services": *[_type == "service"]{
    title,
    description,
    number,
    peekImage{
      alt,
      asset
    }
  }
}`;

type Hotspot = { x?: number; y?: number } | null;

type ImageField = {
  alt?: string | null;
  hotspot?: Hotspot;
  asset?: { _ref?: string } | null;
  aspect?: number | null;
  width?: number | null;
  height?: number | null;
} | null;

type HomeQuery = {
  settings?: {
    heroTitle?: { line1?: string | null; line2?: string | null } | null;
    aboutText?: string | null;
    base?: string | null;
    disciplines?: string | null;
    email?: string | null;
    instagram?: string | null;
    heroImage?: ImageField;
    aboutPortrait?: ImageField;
  } | null;
  projects?: Array<{
    title?: string | null;
    slug?: string | null;
    discipline?: string | null;
    date?: string | null;
    order?: number | null;
    cover?: ImageField;
  }> | null;
  services?: Array<{
    title?: string | null;
    description?: string | null;
    number?: string | null;
    peekImage?: ImageField;
  }> | null;
};

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function focal(hotspot: Hotspot | undefined): [number, number] {
  const x = typeof hotspot?.x === "number" && Number.isFinite(hotspot.x) ? hotspot.x : 0.5;
  const y = typeof hotspot?.y === "number" && Number.isFinite(hotspot.y) ? hotspot.y : 0.5;
  return [Math.min(1, Math.max(0, x)), Math.min(1, Math.max(0, y))];
}

function position(hotspot: Hotspot | undefined): string {
  const [x, y] = focal(hotspot);
  return `${(x * 100).toFixed(2)}% ${(y * 100).toFixed(2)}%`;
}

function ratio(image: ImageField): string | null {
  const width = image?.width;
  const height = image?.height;
  if (typeof width !== "number" || typeof height !== "number") return null;
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return null;
  return `${width} / ${height}`;
}

function picture(image: ImageField, width: number): HomeImage | null {
  if (!image?.asset?._ref) return null;
  const src = imageUrl(image, width);
  if (!src) return null;
  return {
    src,
    alt: text(image.alt),
    position: position(image.hotspot),
    ratio: ratio(image),
  };
}

function paragraphs(value: unknown): string[] {
  return text(value)
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function emailOf(value: unknown): string {
  const email = text(value);
  if (!email.includes("@") || /\s/.test(email)) return "";
  return email;
}

function aspectOf(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : undefined;
}

function emptyHome(): HomeContent {
  return {
    hero: { image: null, line1: "", line2: "" },
    projects: [],
    services: [],
    about: { paragraphs: [], portrait: null, base: "", disciplines: "" },
    contact: { email: "", instagram: "" },
  };
}

function normalize(data: HomeQuery | null): HomeContent {
  const settings = data?.settings;
  const projects: RibbonProject[] = (data?.projects ?? [])
    .map((project) => {
      const cover = picture(project.cover ?? null, 2000);
      const aspect = aspectOf(project.cover?.aspect);
      const name = text(project.title);
      const frame: RibbonProject = {
        src: cover?.src ?? "",
        pos: focal(project.cover?.hotspot),
        name,
        meta: [text(project.discipline), text(project.date)].filter(Boolean).join(" · "),
        href: text(project.slug) ? `/proyectos/${encodeURIComponent(text(project.slug))}` : null,
        label: name || undefined,
      };
      if (aspect) frame.ar = aspect;
      return {
        frame,
        order: typeof project.order === "number" && Number.isFinite(project.order) ? project.order : Number.POSITIVE_INFINITY,
      };
    })
    .sort((a, b) => a.order - b.order)
    .map((item) => item.frame);

  const services: ServiceItem[] = (data?.services ?? [])
    .map((service, index) => ({
      title: text(service.title),
      number: text(service.number) || String(index + 1).padStart(2, "0"),
      copy: text(service.description),
      peek: picture(service.peekImage ?? null, 800)?.src ?? "",
      sort: text(service.number),
      index,
    }))
    .sort((a, b) => {
      const left = Number.parseInt(a.sort, 10);
      const right = Number.parseInt(b.sort, 10);
      const leftRank = Number.isFinite(left) ? left : a.index;
      const rightRank = Number.isFinite(right) ? right : b.index;
      return leftRank - rightRank || a.index - b.index;
    })
    .map(({ title, number, copy, peek }) => ({ title, number, copy, peek }));

  return {
    hero: {
      image: picture(settings?.heroImage ?? null, 2400),
      line1: text(settings?.heroTitle?.line1),
      line2: text(settings?.heroTitle?.line2),
    },
    projects,
    services,
    about: {
      paragraphs: paragraphs(settings?.aboutText),
      portrait: picture(settings?.aboutPortrait ?? null, 1600),
      base: text(settings?.base),
      disciplines: text(settings?.disciplines),
    },
    contact: {
      email: emailOf(settings?.email),
      instagram: text(settings?.instagram),
    },
  };
}

export async function getHomeContent(): Promise<HomeContent> {
  "use cache";
  cacheLife("minutes");
  cacheTag("home");

  if (!projectId) return emptyHome();

  try {
    const endpoint = new URL(
      `https://${projectId}.apicdn.sanity.io/v${API_VERSION}/data/query/${dataset}`,
    );
    endpoint.searchParams.set("query", HOME_QUERY);
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`Sanity respondió ${response.status}`);
    const body = (await response.json()) as { result?: HomeQuery | null };
    return normalize(body.result ?? null);
  } catch (error) {
    console.error("No se pudo leer Sanity.", error);
    return emptyHome();
  }
}

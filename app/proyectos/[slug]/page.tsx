import { RevealTitle, fontMono, fontText, sectionTitle } from "@/components/home/reveal-title";
import { getProjectPage, getProjectSlugs, type ProjectPhoto } from "@/sanity/lib/project";
import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

const gutter = "clamp(16px, 3vw, 40px)";

const metaBar: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
  gap: "8px 24px",
  padding: "14px 0",
  borderTop: "1px solid #111111",
  fontFamily: fontMono,
  fontSize: 12,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const factRow: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "112px minmax(0, 1fr)",
  gap: 12,
  padding: "9px 0",
  borderBottom: "1px solid #DCDAD3",
};

const factLabel: CSSProperties = {
  fontFamily: fontMono,
  fontSize: 10,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#787774",
};

const factValue: CSSProperties = {
  margin: 0,
  fontFamily: fontMono,
  fontSize: 11,
  letterSpacing: "0.02em",
  color: "#111111",
};

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/proyectos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectPage(slug);
  const title = project?.title ? `${project.title} · Proyecto` : "Proyecto";
  return { title };
}

export default function Page({ params }: PageProps<"/proyectos/[slug]">) {
  return (
    <Suspense fallback={<main className="site" style={{ minHeight: "100vh", background: "#F7F6F3" }} />}>
      <ProjectScreen params={params} />
    </Suspense>
  );
}

async function ProjectScreen({ params }: Pick<PageProps<"/proyectos/[slug]">, "params">) {
  const { slug } = await params;
  const project = await getProjectPage(slug);
  if (!project) notFound();

  const meta = [project.place, project.date].filter(Boolean).join(" · ");
  const facts = [
    ["Lugar", project.place],
    ["Disciplina", project.discipline],
    ["Fecha", project.date],
  ].filter(([, value]) => value);
  const gear = [
    ["Cámara", project.camera],
    ["Lentes", project.lenses],
    ["Iluminación", project.light],
  ].filter(([, value]) => value);
  const next = project.next ?? { title: "Proyectos", href: "/#trabajo" };

  return (
    <main className="site" style={{ background: "#F7F6F3", color: "#111111", fontFamily: fontText, fontSize: 16, lineHeight: 1.6 }}>
      <header style={{ padding: `24px ${gutter}` }}>
        <div
          style={{
            maxWidth: 1600,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px 32px",
            fontFamily: fontMono,
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <a href="/#trabajo" style={{ display: "inline-flex", alignItems: "center", gap: 10, minHeight: 44 }}>
            ← Proyectos
          </a>
          <span>Guillermo López</span>
          <a href="/#contacto" style={{ minHeight: 44, display: "inline-flex", alignItems: "center" }}>
            Contacto
          </a>
        </div>
      </header>

      <section style={{ padding: `clamp(48px, 6vw, 96px) ${gutter} 0` }}>
        <div style={{ position: "relative", zIndex: 2, maxWidth: 1600, margin: "0 auto", display: "flex", flexDirection: "column" }}>
          <div style={metaBar}>
            <span>Proyecto destacado</span>
            {meta ? <span style={{ color: "#787774" }}>{meta}</span> : null}
          </div>
          <RevealTitle text={project.title || "Proyecto"} style={{ margin: "clamp(24px, 3vw, 48px) 0 0" }} />

          {project.summary || project.statNumber || project.statLabel ? (
            <div style={{ marginTop: "clamp(48px, 5vw, 80px)", display: "flex", flexDirection: "column", gap: 40, maxWidth: 760 }}>
              {project.summary ? (
                <p
                  style={{
                    margin: 0,
                    fontFamily: fontText,
                    fontWeight: 400,
                    fontSize: "clamp(16px, 1.25vw, 19px)",
                    lineHeight: 1.65,
                    letterSpacing: "-0.005em",
                    color: "#111111",
                  }}
                >
                  {project.summary}
                </p>
              ) : null}
              {project.statNumber || project.statLabel ? (
                <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
                  {project.statNumber ? (
                    <span
                      style={{
                        fontFamily: "var(--font-anton), sans-serif",
                        fontSize: "clamp(44px, 5vw, 84px)",
                        lineHeight: 0.95,
                        letterSpacing: "-0.005em",
                        color: "#111111",
                      }}
                    >
                      {project.statNumber}
                    </span>
                  ) : null}
                  {project.statLabel ? (
                    <span
                      style={{
                        fontFamily: fontMono,
                        fontSize: 12,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        lineHeight: 1.5,
                        color: "#2F3437",
                      }}
                    >
                      {project.statLabel.split("\n").map((line, index) => (
                        <span key={`${index}-${line}`}>
                          {index > 0 ? <br /> : null}
                          {line}
                        </span>
                      ))}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}

          {facts.length || gear.length ? (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "48px clamp(32px, 6vw, 120px)",
                marginTop: "clamp(48px, 5vw, 80px)",
              }}
            >
              {facts.length ? <FactList rows={facts} /> : null}
              {gear.length ? <FactList rows={gear} /> : null}
            </div>
          ) : null}

          {project.gallery.length ? <Gallery photos={project.gallery} /> : null}
        </div>
      </section>

      <section style={{ padding: `clamp(120px, 12vw, 200px) ${gutter} 40px` }}>
        <div style={{ maxWidth: 1600, margin: "0 auto" }}>
          <a
            href={next.href}
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "16px 32px",
              paddingTop: 14,
              borderTop: "1px solid #111111",
            }}
          >
            <span style={{ fontFamily: fontMono, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {project.next ? "Siguiente proyecto" : "Volver"}
            </span>
            <span style={sectionTitle}>{next.title} →</span>
          </a>
        </div>
      </section>
    </main>
  );
}

function FactList({ rows }: { rows: string[][] }) {
  return (
    <dl style={{ flex: "1 1 320px", maxWidth: 520, margin: 0, borderTop: "1px solid #DCDAD3" }}>
      {rows.map(([label, value]) => (
        <div key={label} style={factRow}>
          <dt style={factLabel}>{label}</dt>
          <dd style={factValue}>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Gallery({ photos }: { photos: ProjectPhoto[] }) {
  const frames = framesOf(photos);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: "clamp(64px, 7vw, 112px)" }}>
      {frames.map((frame, index) => (
        <figure
          key={`${frame.photo.src}-${index}`}
          className="shot reveal"
          style={{
            flex: frame.flex,
            margin: 0,
            borderRadius: 8,
            overflow: "hidden",
            height: frame.height,
            background: "#EAEAEA",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={frame.photo.src}
            alt={frame.photo.alt}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: frame.photo.position, display: "block" }}
          />
        </figure>
      ))}
    </div>
  );
}

function framesOf(photos: ProjectPhoto[]) {
  const frames: Array<{ photo: ProjectPhoto; flex: string; height: string }> = [];
  let fulls = 0;
  let pairs = 0;

  for (let index = 0; index < photos.length; index += 1) {
    const photo = photos[index];
    const next = photos[index + 1];
    const paired = photo.layout !== "full" && next && next.layout !== "full";
    if (!paired) {
      const lead = fulls === 0;
      fulls += 1;
      frames.push({
        photo,
        flex: "1 1 100%",
        height: lead ? "clamp(420px, 50vw, 820px)" : "clamp(420px, 52vw, 860px)",
      });
      continue;
    }

    const lead = pairs === 0;
    pairs += 1;
    const narrow = lead ? "360px" : "420px";
    const height = lead ? "clamp(360px, 36vw, 600px)" : "clamp(360px, 34vw, 560px)";
    const wideFirst = photo.layout !== "5-7";
    frames.push(
      { photo, flex: wideFirst ? "7 1 520px" : `5 1 ${narrow}`, height },
      { photo: next, flex: wideFirst ? `5 1 ${narrow}` : "7 1 520px", height },
    );
    index += 1;
  }

  return frames;
}

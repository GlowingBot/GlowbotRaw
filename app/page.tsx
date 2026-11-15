import { HeatTrail } from "@/components/home/heat-trail";
import { ProjectRibbon } from "@/components/home/project-ribbon";
import { RevealTitle, fontMono, fontSans, fontText } from "@/components/home/reveal-title";
import { Services } from "@/components/home/services";
import { getHomeContent } from "@/sanity/lib/home";

const shell = "calc(1600px + 2 * clamp(16px, 3vw, 40px))";
const gutter = "clamp(16px, 3vw, 40px)";

export default async function Home() {
  const content = await getHomeContent();
  const { hero, about, contact } = content;
  const serviceLine = content.services
    .map((service) => service.title)
    .filter(Boolean)
    .join(" · ");

  return (
    <main
      className="site"
      style={{
        position: "relative",
        background: "#F7F6F3",
        color: "#111111",
        fontFamily: fontSans,
        fontSize: 16,
        lineHeight: 1.6,
      }}
    >
      <HeatTrail />

      <section
        id="inicio"
        className="vh-screen"
        style={{
          position: "relative",
          minHeight: 560,
          overflow: "hidden",
          background: "#111111",
          color: "#FFFFFF",
        }}
      >
        {hero.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={hero.mobileImage ? "hero-img hero-web" : "hero-img"}
            src={hero.image.src}
            alt={hero.image.alt}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: hero.image.position,
            }}
          />
        ) : null}
        {hero.mobileImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="hero-img hero-mobile"
            src={hero.mobileImage.src}
            alt={hero.mobileImage.alt}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: hero.mobileImage.position,
            }}
          />
        ) : null}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.62) 100%)",
          }}
        />
        <header
          style={{
            position: "absolute",
            zIndex: 3,
            top: 0,
            left: 0,
            right: 0,
            maxWidth: shell,
            margin: "0 auto",
            boxSizing: "border-box",
            padding: `24px ${gutter}`,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px 32px",
          }}
        >
          <a
            href="#inicio"
            style={{
              color: "#FFFFFF",
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            Guillermo López
          </a>
          <nav aria-label="Principal" style={{ display: "flex", flexWrap: "wrap", gap: "4px 28px" }}>
            <a
              className="ul"
              href="#trabajo"
              style={{ color: "rgba(255,255,255,0.82)", fontSize: 14, padding: "10px 0" }}
            >
              Proyectos
            </a>
            <a
              className="ul"
              href="#sobre-mi"
              style={{ color: "rgba(255,255,255,0.82)", fontSize: 14, padding: "10px 0" }}
            >
              Sobre mí
            </a>
            <a
              className="ul"
              href="#contacto"
              style={{
                color: "#FFFFFF",
                fontSize: 14,
                padding: "10px 0",
                textDecoration: "underline",
                textUnderlineOffset: 6,
              }}
            >
              Contacto
            </a>
          </nav>
        </header>
        <div
          className="hero-in"
          style={{
            position: "absolute",
            zIndex: 3,
            left: 0,
            right: 0,
            bottom: 0,
            maxWidth: shell,
            margin: "0 auto",
            boxSizing: "border-box",
            padding: `0 ${gutter} 32px`,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "24px 48px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: "100%" }}>
            <span
              style={{
                fontFamily: fontMono,
                fontSize: 12,
                letterSpacing: "0.06em",
                color: "rgba(255,255,255,0.78)",
              }}
            >
              Fotografío el movimiento · CDMX
            </span>
            <h1
              style={{
                margin: 0,
                fontFamily: "var(--font-anton), sans-serif",
                fontWeight: 400,
                fontSize: "clamp(28px, 5.6vw, 96px)",
                lineHeight: 0.95,
                letterSpacing: "-0.005em",
                textTransform: "uppercase",
                color: "#FFFFFF",
              }}
            >
              {hero.line1 ? (
                <span style={{ display: "block", whiteSpace: "nowrap" }}>{hero.line1}</span>
              ) : null}
              {hero.line2 ? (
                <span style={{ display: "block", whiteSpace: "nowrap" }}>{hero.line2}</span>
              ) : null}
            </h1>
          </div>
        </div>
      </section>

      <ProjectRibbon projects={content.projects} />
      <Services services={content.services} />

      <section
        id="sobre-mi"
        style={{
          padding: "clamp(48px, 5vw, 80px) clamp(16px, 3vw, 40px) clamp(120px, 12vw, 200px)",
          background: "#0E0E0D",
          color: "#F3F1EA",
        }}
      >
        <div style={{ maxWidth: 1600, margin: "0 auto", display: "flex", flexDirection: "column" }}>
          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: "8px 24px",
              padding: "14px 0",
              borderTop: "1px solid #F3F1EA",
              fontFamily: fontMono,
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            <span>Guillermo López</span>
            <span style={{ color: "#9C988F" }}>CDMX</span>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "48px clamp(24px, 2.5vw, 40px)",
              marginTop: "clamp(48px, 5vw, 80px)",
            }}
          >
            <div
              style={{
                position: "relative",
                zIndex: 2,
                flex: "0 1 640px",
                maxWidth: 640,
                display: "flex",
                flexDirection: "column",
                gap: 40,
              }}
            >
              <RevealTitle text="Sobre mí" style={{ color: "#F3F1EA", whiteSpace: "nowrap" }} />
              {about.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  style={
                    index === 0
                      ? {
                          margin: 0,
                          fontFamily: fontText,
                          fontWeight: 400,
                          fontSize: "clamp(16px, 1.25vw, 19px)",
                          lineHeight: 1.65,
                          letterSpacing: "-0.005em",
                          maxWidth: 560,
                          color: "#F3F1EA",
                        }
                      : {
                          margin: 0,
                          fontFamily: fontMono,
                          fontSize: 15,
                          lineHeight: 1.65,
                          color: "#BDB9B0",
                        }
                  }
                >
                  {paragraph}
                </p>
              ))}
              {about.base || about.disciplines ? (
                <dl style={{ margin: 0, borderTop: "1px solid rgba(243,241,234,0.16)" }}>
                  {about.base ? <Fact label="Base" value={about.base} light /> : null}
                  {about.disciplines ? <Fact label="Disciplinas" value={about.disciplines} light /> : null}
                </dl>
              ) : null}
            </div>
            {about.portrait ? (
              <figure
                style={{
                  flex: "1 1 520px",
                  maxWidth: 900,
                  margin: "0 calc(-1 * clamp(16px, 3vw, 40px)) 0 0",
                  alignSelf: "center",
                  aspectRatio: about.portrait.ratio ?? "1 / 1",
                  background: "#0E0E0D",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={about.portrait.src}
                  alt={about.portrait.alt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    objectPosition: about.portrait.position,
                    display: "block",
                  }}
                />
              </figure>
            ) : null}
          </div>
        </div>
      </section>

      <section
        id="contacto"
        style={{
          padding: "clamp(120px, 12vw, 200px) clamp(16px, 3vw, 40px) 32px",
        }}
      >
        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 1600,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "48px clamp(32px, 6vw, 120px)",
            }}
          >
            <RevealTitle text="Contacto" />
            <div style={{ flex: "0 1 520px", display: "flex", flexDirection: "column", gap: 20 }}>
              <p
                style={{
                  margin: 0,
                  fontFamily: fontMono,
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#787774",
                }}
              >
                Nuevos proyectos · CDMX
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: fontText,
                  fontSize: "clamp(16px, 1.25vw, 19px)",
                  lineHeight: 1.65,
                  color: "#2F3437",
                  maxWidth: 440,
                }}
              >
                Sesiones con atletas, contenido para marcas y cobertura de eventos. Cuéntame qué momento quieres que se quede.
              </p>
              {contact.email ? (
                <a
                  className="mail"
                  href={`mailto:${contact.email}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "18px 0",
                    borderTop: "1px solid #111111",
                    borderBottom: "1px solid #111111",
                    fontFamily: fontText,
                    fontWeight: 500,
                    fontSize: "clamp(20px, 1.8vw, 26px)",
                    letterSpacing: "-0.02em",
                    color: "#111111",
                  }}
                >
                  <span>{contact.email}</span>
                  <svg
                    aria-hidden="true"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 17L17 7" />
                    <path d="M8 7h9v9" />
                  </svg>
                </a>
              ) : null}
              <dl style={{ margin: 0 }}>
                {contact.instagram ? <Fact label="Instagram" value={contact.instagram} /> : null}
                {serviceLine ? <Fact label="Servicios" value={serviceLine} /> : null}
              </dl>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px 24px",
              marginTop: "clamp(96px, 10vw, 160px)",
              paddingTop: 16,
              borderTop: "1px solid #DCDAD3",
              fontFamily: fontMono,
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#787774",
            }}
          >
            <span>© 2026 Guillermo López</span>
            <span>Fotografío el movimiento</span>
            <a href="#inicio" style={{ color: "#111111", padding: "12px 0" }}>
              Volver arriba ↑
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function Fact({
  label,
  value,
  light = false,
}: {
  label: string;
  value: string;
  light?: boolean;
}) {
  const line = light ? "rgba(243,241,234,0.16)" : "#DCDAD3";
  const labelColor = light ? "#9C988F" : "#787774";
  const valueColor = light ? "#F3F1EA" : "#111111";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "96px minmax(0, 1fr)",
        gap: 12,
        padding: "9px 0",
        borderBottom: `1px solid ${line}`,
      }}
    >
      <dt
        style={{
          fontFamily: fontMono,
          fontSize: 10,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: labelColor,
        }}
      >
        {label}
      </dt>
      <dd
        style={{
          margin: 0,
          fontFamily: fontMono,
          fontSize: 11,
          letterSpacing: "0.02em",
          color: valueColor,
        }}
      >
        {value}
      </dd>
    </div>
  );
}

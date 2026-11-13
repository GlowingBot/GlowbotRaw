# Portafolio de Guillermo López · Brief para construir el sitio

## Qué hay en esta carpeta

- `sitio/`: el diseño aprobado, funcionando en HTML, CSS y JS sin dependencias. Abre `sitio/index.html` en el navegador. **Esta es la fuente de verdad visual y de interacciones.** Si algo de este brief contradice lo que se ve ahí, gana lo que se ve.
- `sitio/img/`: todas las fotos con nombres claros.
- `sitio/js/main.js`: las interacciones (rastro de calor, foto que sigue al cursor en Servicios, tira horizontal de Proyectos en canvas).

## Objetivo

Convertir `sitio/` en un sitio real, administrable desde un panel, sin perder nada del diseño ni de las interacciones.

## Stack

- **Next.js** (App Router, TypeScript) desplegado en **Vercel** (ya tengo Vercel Pro).
- **Sanity** (plan gratis) como panel para proyectos, fotos y textos. Sanity Studio embebido en `/studio`.
- Imágenes servidas desde el CDN de Sanity con `@sanity/image-url` (formatos modernos y tamaños por pantalla).
- Revalidación on-demand con un webhook de Sanity a `/api/revalidate`, para que los cambios del panel salgan sin redeploy.
- Fuentes con `next/font/google`: Anton (títulos), Geist (texto), Geist Mono (etiquetas y metadatos).

## Orden de trabajo (hazlo por etapas y para entre una y otra)

1. Setup de Next.js con las fuentes, los colores y los estilos globales de `sitio/index.html`.
2. Home estática idéntica a `sitio/index.html`, con las interacciones portadas a componentes de cliente.
3. Esquemas de Sanity y Studio en `/studio`.
4. Conectar la home y la página de proyecto a Sanity.
5. Página de proyecto dinámica `/proyectos/[slug]` basada en `sitio/proyecto-machetazo.html`.
6. Webhook de revalidación, headers de seguridad y deploy.

## Diseño (tokens)

- Fondo claro `#F7F6F3`, texto `#111111`, secundario `#787774`, líneas `#DCDAD3`.
- Secciones oscuras (Servicios y Sobre mí) `#0E0E0D`, texto `#F3F1EA`, secundario `#9C988F`.
- Márgenes laterales `clamp(16px, 3vw, 40px)` en todo el sitio. Ancho máximo del contenido 1600px. Todos los textos de todas las secciones comparten esos mismos bordes.
- Títulos de sección en Anton, mayúsculas, `clamp(64px, 9vw, 160px)`, interlineado 0.86. Solo hay dos tamaños de título en todo el sitio, no inventes otros.
- Easing en todo: `cubic-bezier(.16,1,.3,1)`.

## Secciones de la home (en este orden)

1. **Hero**: foto a pantalla completa (`hero-berm-publico.jpg`), nav arriba y título abajo a la izquierda en dos líneas que nunca se parten: "El momento no vuelve." / "La foto se queda." Zoom suave al cargar; al hacer scroll se oscurece y desenfoca.
2. **Proyectos**: sección fija con scroll horizontal (ver interacciones). El título "PROYECTOS" se encima sobre la parte de arriba de las fotos.
3. **Servicios** (fondo oscuro): Atletas, Marcas y Eventos como filas grandes. "Atletas" cubre MTB, BMX, skate, breaking, básquet y cualquier deporte urbano o de acción.
4. **Sobre mí** (fondo oscuro): texto a la izquierda, retrato a la derecha fundido con el fondo negro.
5. **Contacto**: título, texto corto, correo grande y footer.

## Interacciones (copiar los valores de `sitio/js/main.js`)

- **Tira de Proyectos** (canvas, `initRibbon`): la sección mide `(N - 1) * 70 + 100` vh y es sticky. El scroll vertical mueve las fotos en horizontal con amortiguamiento por tiempo (`1 - exp(-dt * 3.6)`), igual en 60 y en 120 Hz. Al entrar, las fotos se abren como un obturador: una franja al centro se abre hacia arriba y hacia abajo con un leve asentamiento de escala. Abajo se ven el nombre y el número del proyecto actual.
- **Fotos verticales en la tira**: cada cuadro respeta la proporción real de su foto. Las horizontales ocupan todo el ancho (con recorte por hotspot) y las verticales (proporción menor a 1.2) entran más angostas, con el mismo alto. El cuadro actual se alinea al margen izquierdo y, al final, la tira se detiene en el margen derecho para no dejar hueco. En Sanity, la proporción se lee de los metadatos de la imagen (`asset->metadata.dimensions.aspectRatio`).
- **Hover en las fotos de Proyectos**: se oculta el cursor y aparece un anillo de 120px que sigue al mouse con inercia, con "VER PROYECTO ·" girando alrededor en Geist Mono 10px, en modo `difference`, más un punto al centro. La foto hace un zoom muy leve (2.5%) y lento. Al hacer clic se abre la página del proyecto.
- **Rastro de calor** (`initHeat`): manchas difuminadas que siguen al cursor por todo el sitio, detrás del contenido, cambiando de naranja a azul y desapareciendo en 8 segundos. Solo en dispositivos con hover.
- **Servicios** (`initPeek`): al pasar por cada fila aparece una foto de 300×200 que sigue al cursor, ligeramente rotada. Las otras filas se atenúan.
- **Títulos de sección**: entrada letra por letra ligada al scroll (`animation-timeline: view()`), de izquierda a derecha.
- **Fotos de la página de proyecto**: se revelan con clip-path al entrar y el zoom se asienta.
- Todo debe respetar `prefers-reduced-motion` y degradarse bien donde no exista `animation-timeline`.

## Esquemas de Sanity

- `project`: title, slug, discipline, place, date, light (equipo de luz), riders, summary (texto), stat (número + etiqueta, ej. "6 atletas con más de 10 mil seguidores compartieron la serie"), cover (imagen con hotspot, horizontal o vertical), gallery (imágenes con alt obligatorio y layout: ancho completo / 7-5 / 5-7), order (número).
- `service`: title, description, number, peekImage.
- `siteSettings`: heroImage, heroTitle (2 líneas), aboutText, aboutPortrait, email, instagram.
- Usa el hotspot de Sanity para el encuadre de cada foto en la tira (equivale a `pos` en `main.js`).

## Seguridad (no negociable)

- 2FA en GitHub, Vercel, Sanity y el registrador del dominio. Domain lock activado.
- El sitio público lee Sanity **sin token** (dataset público, solo lectura).
- Nunca escribas tokens ni llaves en el código. Van como variables de entorno en Vercel. Nada secreto con prefijo `NEXT_PUBLIC_`.
- Repo privado, `.env*` en `.gitignore`, Dependabot activado.
- El webhook de revalidación valida la firma de Sanity (`@sanity/webhook`) y rechaza todo lo demás.
- CORS de Sanity limitado a mi dominio y a localhost.
- Headers de seguridad en `next.config`: Content-Security-Policy, X-Content-Type-Options, Referrer-Policy, Permissions-Policy y frame-ancestors.
- Quitar GPS y datos personales EXIF de las fotos antes de subirlas.
- Release 2 (formulario de contacto): nunca guardar mensajes en Sanity, porque el dataset es público. Usar Resend (email) o Supabase con RLS, Cloudflare Turnstile + honeypot, validación en servidor y rate limit por IP.

## Pendientes de contenido

- Nombres, disciplina y año de los proyectos 01 a 05 (hoy dicen "[Proyecto 0X]").
- Nombre, lugar y año del proyecto de viajes / street (la foto ya está).
- Correo de contacto real (hoy dice "[tu correo de foto]").
- Lugar, fecha y riders de Machetazo.

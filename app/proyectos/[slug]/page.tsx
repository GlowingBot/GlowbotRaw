import { ProjectScreen } from "@/components/project/project-screen";
import { getProjectPage, getProjectSlugs } from "@/sanity/lib/project";
import type { Metadata } from "next";
import { Suspense } from "react";

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

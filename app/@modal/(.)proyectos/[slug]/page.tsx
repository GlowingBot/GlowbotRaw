import { ProjectScreen } from "@/components/project/project-screen";
import { ProjectSheet } from "@/components/project/project-sheet";
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
    <ProjectSheet>
      <Suspense fallback={<div style={{ minHeight: "60vh" }} />}>
        <ProjectScreen params={params} sheet />
      </Suspense>
    </ProjectSheet>
  );
}

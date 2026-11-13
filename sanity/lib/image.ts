import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "../env";

const builder = projectId ? createImageUrlBuilder({ projectId, dataset }) : null;

export function imageUrl(source: SanityImageSource | null | undefined, width: number): string | null {
  if (!builder || !source) return null;
  try {
    return builder.image(source).ignoreImageParams().width(width).fit("max").auto("format").url();
  } catch {
    return null;
  }
}

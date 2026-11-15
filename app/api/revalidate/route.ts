import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return Response.json({ error: "Webhook no configurado" }, { status: 500 });
  }

  const signature = request.headers.get(SIGNATURE_HEADER_NAME);
  const body = await request.text();
  const valid = signature ? await isValidSignature(body, signature, secret) : false;
  if (!valid) {
    return Response.json({ error: "Firma inválida" }, { status: 401 });
  }

  revalidateTag("home", "max");
  return Response.json({ revalidated: true });
}

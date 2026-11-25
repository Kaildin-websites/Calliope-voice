import { z } from "zod";
import { getDb } from "../../../db";
import { requests } from "../../../db/schema";
import { agents, sectors, volumes } from "../../../lib/trial";

const field = (max: number) => z.string().trim().min(1).max(max);
const payload = z.object({
  id: z.string().uuid(),
  name: field(100),
  business: field(160),
  phone: z.string().trim().max(32).regex(/^[+\d\s().-]+$/).refine(v => /^\d{6,16}$/.test(v.replace(/\D/g, ""))),
  email: z.string().trim().email().max(254),
  sector: z.enum(sectors),
  monthlyLeads: z.enum(volumes),
  crm: z.string().trim().max(160).optional(),
  agent: z.enum(agents).optional(),
});

export async function POST(request: Request) {
  const origin = request.headers.get("Origin");
  if (origin && new URL(request.url).origin !== origin) {
    return Response.json({ error: "Origine non valida." }, { status: 403 });
  }
  let data: unknown;
  try { data = await request.json(); }
  catch { return Response.json({ error: "Modulo non valido." }, { status: 400 }); }
  const parsed = payload.safeParse(data);
  if (!parsed.success) return Response.json({ error: "Verifica i campi, in particolare telefono ed email." }, { status: 422 });
  try {
    await getDb().insert(requests).values({
      ...parsed.data,
      userId: request.headers.get("oai-authenticated-user-id"),
      createdAt: new Date(),
    }).onConflictDoNothing({ target: requests.id });
    return Response.json({ saved: true }, { status: 201 });
  } catch {
    return Response.json({ error: "Invio non riuscito. I tuoi dati sono ancora nel modulo. Riprova." }, { status: 503 });
  }
}

import { desc, eq } from "drizzle-orm";
import { getDb } from "../../db";
import { requests } from "../../db/schema";
import { requireChatGPTUser } from "../chatgpt-auth";
export const dynamic = "force-dynamic";
export default async function Account() {
  const user = await requireChatGPTUser("/richieste");
  const rows = await getDb().select({ id: requests.id, createdAt: requests.createdAt, business: requests.business, agent: requests.agent }).from(requests).where(eq(requests.userId, user.userId)).orderBy(desc(requests.createdAt)).limit(50);
  return <main className="account"><a className="wordmark" href="/"><img src="/assets/calliope-muse.webp" alt="" />Calliope-voice</a><h1>Le tue richieste</h1>
  {rows.length ? <ul>{rows.map(r => <li key={r.id}><b>{r.business}</b><span>{r.agent ? "Calliope " + r.agent : "Prova su 5 chiamate"} · {r.createdAt.toLocaleDateString("it-IT")}</span></li>)}</ul> : <p>Non hai ancora richiesto la prova.</p>}
  <a className="btn" href="/#prova">Richiedi la prova</a><a className="text-link" href="/">Torna alla home</a></main>;
}

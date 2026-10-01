export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Método no permitido." }), { status: 405, headers: { "Content-Type": "application/json" } });
  const key = process.env.OPENAI_API_KEY;
  if (!key) return new Response(JSON.stringify({ error: "El asistente aún no está conectado. Falta configurar OPENAI_API_KEY en Vercel." }), { status: 503, headers: { "Content-Type": "application/json" } });
  try {
    const body = await req.json() as { messages?: { role: string; content: string }[]; products?: unknown[] };
    const messages = Array.isArray(body.messages) ? body.messages.slice(-12).filter(m => (m.role === "user" || m.role === "assistant") && typeof m.content === "string").map(m => ({ role: m.role, content: m.content.slice(0, 3000) })) : [];
    const catalog = Array.isArray(body.products) ? JSON.stringify(body.products).slice(0, 14000) : "[]";
    if (!messages.length) return new Response(JSON.stringify({ error: "Escribe una pregunta para empezar." }), { status: 400, headers: { "Content-Type": "application/json" } });
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        instructions: "Eres el asistente de Miwuko, una web española de recomendaciones para mascotas. Responde en español, con claridad y de forma práctica. Puedes resolver dudas generales, preguntar qué necesita la persona y orientar sobre productos. Usa el catálogo proporcionado como fuente para los productos de Miwuko; no inventes disponibilidad, características ni enlaces. Si recomiendas un producto del catálogo, incluye su enlace affiliateUrl exacto solo si es una URL http(s) válida; si no tiene enlace, dilo claramente y no inventes uno. Si faltan datos, haz una pregunta breve. No afirmes ser veterinario y deriva al veterinario ante síntomas, urgencias o dudas clínicas. Catálogo actual: " + catalog,
        input: messages
      })
    });
    const data = await response.json() as { output_text?: string; error?: { message?: string } };
    if (!response.ok) return new Response(JSON.stringify({ error: data.error?.message || "El servicio de IA no ha podido responder." }), { status: 502, headers: { "Content-Type": "application/json" } });
    return new Response(JSON.stringify({ reply: data.output_text || "No he podido generar una respuesta. ¿Puedes reformular la pregunta?" }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch {
    return new Response(JSON.stringify({ error: "No se pudo procesar la pregunta. Inténtalo de nuevo." }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
}
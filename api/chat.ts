import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'Falta configurar OPENAI_API_KEY en Vercel' });
  const { messages = [], products = [] } = req.body ?? {};
  if (!Array.isArray(messages)) return res.status(400).json({ error: 'Mensajes no válidos' });

  const catalog = Array.isArray(products) ? products.slice(0, 100) : [];
  const system = [
    'Eres Miwuko, un asistente en español que ayuda a elegir productos para perros y gatos.',
    'Responde de forma clara, útil y natural. Usa el catálogo proporcionado cuando recomiendes productos; no inventes productos, precios, enlaces ni características.',
    'Si recomiendas un producto, incluye su precio y enlace de afiliado solo si aparecen en el catálogo.',
    'Para síntomas, intoxicaciones o tratamientos, no diagnostiques: recomienda contactar con un veterinario.',
    'Si la pregunta no tiene relación con mascotas o el catálogo, responde brevemente y vuelve a ofrecer ayuda con Miwuko.'
  ].join(' ');
  try {
    const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [{ role: 'system', content: system + '\\n\\nCatálogo actual: ' + JSON.stringify(catalog) }, ...messages.slice(-12)],
        temperature: 0.5,
        max_tokens: 700
      })
    });
    const data = await upstream.json();
    if (!upstream.ok) return res.status(502).json({ error: data.error?.message || 'Error del proveedor de IA' });
    return res.status(200).json({ reply: data.choices?.[0]?.message?.content || 'No he podido generar una respuesta.' });
  } catch {
    return res.status(502).json({ error: 'No se pudo conectar con el servicio de IA' });
  }
}

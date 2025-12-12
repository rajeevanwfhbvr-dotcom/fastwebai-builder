// api_generate_example.js
// Example Vercel serverless function (Node) — save as api/generate.js in your project for Vercel
const fetch = require('node-fetch');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });
  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_KEY) return res.status(500).json({ error: 'No OpenAI key configured' });
  try{
    const body = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an AI website builder. Output a complete HTML body with minimal inline CSS. Do NOT include external scripts.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 2500
    };
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await r.json();
    const content = data?.choices?.[0]?.message?.content;
    return res.status(200).json({ ok: true, html: content, raw: data });
  }catch(err){
    console.error(err);
    return res.status(500).json({ error: err.message || String(err) });
  }
};
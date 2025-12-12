export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt missing" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a website builder. Always return ONLY complete valid HTML with inline CSS. Do not add explanations."
          },
          {
            role: "user",
            content: `Create a professional website based on this description: ${prompt}`
          }
        ]
      })
    });

    const data = await response.json();
    const html = data.choices?.[0]?.message?.content;

    return res.status(200).json({
      html: html || "<h1>Failed to generate website</h1>"
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

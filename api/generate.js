export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt missing" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `Generate a clean HTML website based on this description:\n${prompt}`,
      }),
    });

    const data = await response.json();

    const text =
      data.output_text ||
      "<h2>AI did not return HTML. Try again.</h2>";

    res.status(200).json({ html: text });
  } catch (err) {
    res.status(500).json({ error: "AI error", details: err.message });
  }
}

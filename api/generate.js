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
        input: `Generate a full HTML website (with CSS inside <style>) based on this description:\n${prompt}`,
      }),
    });

    const data = await response.json();

    const html =
      data.output?.[0]?.content?.[0]?.text ||
      "<h2>No HTML generated. Try again.</h2>";

    res.status(200).json({ html });
  } catch (error) {
    res.status(500).json({ error: "AI error", details: error.message });
  }
}

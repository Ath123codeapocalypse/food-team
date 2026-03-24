export default async function handler(req, res) {
  // ✅ CORS (VERY IMPORTANT)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method Not Allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "No message provided" });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "You are a helpful chatbot." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    // Debug log (optional)
    console.log(data);

    return res.status(200).json({
      reply: data.choices?.[0]?.message?.content || "No response from AI"
    });

  } catch (error) {
    return res.status(500).json({
      reply: "Error: " + error.message
    });
  }
}

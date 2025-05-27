const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4", // or "gpt-3.5-turbo"
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    res.json({
      choices: [
        {
          message: {
            content: response.choices[0].message.content,
          },
        },
      ],
    });
  } catch (error) {
    console.error("OpenAI Error:", error.message);
    res.status(500).json({ error: "Failed to generate content." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

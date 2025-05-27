// server.js
const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

// Load your API key securely from environment variable
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// POST endpoint for blog generation
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await openai.createChatCompletion({
      model: "gpt-4", // or "gpt-3.5-turbo"
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    res.json({
      choices: [
        {
          message: {
            content: response.data.choices[0].message.content,
          },
        },
      ],
    });
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ error: "Failed to generate content." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

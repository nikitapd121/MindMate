const axios = require('axios');
const MAX_CODE_LENGTH = 2000; // characters

exports.analyzeCode = async (req, res) => {
  try {
    const { code, language = 'javascript' } = req.body;
    
    // Validation
    if (!code) return res.status(400).json({ error: "Code is required" });
    if (code.length > MAX_CODE_LENGTH) {
      return res.status(413).json({ error: `Code exceeds ${MAX_CODE_LENGTH} characters` });
    }

    // DeepSeek API Call
    const response = await axios.post(
      process.env.DEEPSEEK_API_URL,
      {
        model: "deepseek-coder",
        messages: [{
          role: "user",
          content: `Analyze this ${language} code (be concise):\n\`\`\`${language}\n${code}\n\`\`\``
        }],
        temperature: 0.3
      },
      {
        headers: { 
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000 // 15 seconds timeout
      }
    );

    res.json({
      analysis: response.data.choices[0].message.content,
      model: "deepseek-coder",
      tokens_used: response.data.usage.total_tokens
    });

  } catch (err) {
    console.error('DeepSeek Error:', err.response?.data || err.message);
    const status = err.response?.status || 500;
    res.status(status).json({
      error: "Code analysis failed",
      suggestion: status === 429 ? "Try again later" : "Check your code and try again"
    });
  }
};
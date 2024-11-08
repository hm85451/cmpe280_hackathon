const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = 5050


app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI("AIzaSyApWdxQQBWBh_dX93oCz5mg_KuwrlT8fh8");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    
    const result = await model.generateContent(message);
    console.log(result.response.text());
    res
    res.json({ reply: result.response.text() });
   
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

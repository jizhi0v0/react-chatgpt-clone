const { OpenAI } = require("openai");
const { IncomingMessage } = require('http');
const express = require('express')
const cors = require('cors')
const {aborted} = require("util");
const app = express()
require('dotenv').config()
app.use(cors())
app.use(express.json())

const API_KEY = process.env.API_KEY
const PORT = 8000
const openai = new OpenAI({
    apiKey: API_KEY // This is also the default, can be omitted
});

app.post('/completions', async (req, res) => {
    // const aborted = req.aborted;
    //  设置返回的请求头为事件流
    res.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });
    //  设置返回状态码
    res.status(200);

    try {
        // New
        const stream = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{"role": "user", "content": req.body.message}],
            stream: true,
        });
        for await (const part of stream) {
            res.write(part.choices[0]?.delta.content || '')
        }
    } catch (error) {
        console.log(error)
        res.end();
    }
    res.end();
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})
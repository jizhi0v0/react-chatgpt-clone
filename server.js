const http = require('http');
const OpenAI = require('openai');
const {parse} = require("url");
require('dotenv').config({path: __dirname + '/.env'})


const openai = new OpenAI({
    apiKey: process.env.REACT_APP_API_KEY
})
http.createServer(async function (req, res) {
    const fileName = "." + req.url;

    let stream;

    req.connection.addListener("close", function () {
        stream.controller.abort();
    }, false);

    if (fileName.indexOf('./stream') !== -1) {
        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": '*',
        });
        const parsedUrl = parse(req.url, true);
        const question = parsedUrl.query.question;
        stream = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{role: 'user', content: question}],
            stream: true,
        });

        for await (const part of stream) {
            res.write('data: ' + (part.choices[0]?.delta?.content || '') + '\n\n');
        }
        res.write('data: ' + 'end' + '\n\n');

    }
}).listen(8844, "127.0.0.1");
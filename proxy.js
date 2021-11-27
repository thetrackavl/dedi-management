const express = require('express');
const request = require('request');

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/session', (req, res) => {
    let port = req.query.port;
    request(
        { url: 'http://localhost:' + port + '/rest/watch/sessionInfo' },
        (error, response, body) => {
            if (error || response.statusCode !== 200) {
                return res.status(500).json({ type: 'error', message: err });
            }
            res.json(JSON.parse(body));
        }
    )
});

app.get('/standings', (req, res) => {
    let port = req.query.port;
    request(
        { url: 'http://localhost:' + port + '/rest/watch/standings' },
        (error, response, body) => {
            if (error || response.statusCode !== 200) {
                return res.status(500).json({ type: 'error', message: err });
            }
            res.json(JSON.parse(body));
        }
    )
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
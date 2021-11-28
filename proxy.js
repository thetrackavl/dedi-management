const express = require('express');
const request = require('request');

var default_api_ip = '192.168.2.102';

var pod_driver_map = {};

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/session', (req, res) => {
    let api_ip = req.query.ip || default_api_ip;
    let port = req.query.port;
    request(
        { url: 'http://' + api_ip + ':' + port + '/rest/watch/sessionInfo' },
        (error, response, body) => {
            if (error || response.statusCode !== 200) {
                return res.status(500).json({ type: 'error', message: error });
            }
            res.json(JSON.parse(body));
        }
    )
});

app.get('/standings', (req, res) => {
    let api_ip = req.query.ip || default_api_ip;
    let port = req.query.port;
    request(
        { url: 'http://' + api_ip + ':' + port + '/rest/watch/standings' },
        (error, response, body) => {
            if (error || response.statusCode !== 200) {
                return res.status(500).json({ type: 'error', message: error });
            }
            res.json(JSON.parse(body));
        }
    )
});

app.post('/clear-penalty', (req, res) => {
    let api_ip = req.query.ip || default_api_ip;
    let port = req.query.port;
    let driver_name = req.query.driver;
    request.post({
        url:     'http://' + api_ip + ':' + port + '/rest/chat',
        body:    '/subpenalty 3 ' + driver_name
      }, function(error, response, body){
        console.log(body);
        res.status(200).send(body);
      });
});

app.post('/nav', (req, res) => {
    let api_ip = req.query.ip || default_api_ip;
    let port = req.query.port;
    let nav_action = req.query.action;
    request.post({
        url:     'http://' + api_ip + ':' + port + '/navigation/action/' + nav_action
      }, function(error, response, body){
        console.log(body);
        res.status(200).send(body);
      });
});

app.post('/driver/map', (req,res) => {
    let pod_id = req.query.pod_id;
    let driver = req.query.driver;
    pod_driver_map[pod_id] = driver;
    console.log(pod_driver_map);
    res.status(200).send('');
});

app.get('/driver/map', (req,res) => {
    console.log(pod_driver_map);
    let driver = req.query.driver;
    let pod_id = 0;
    console.log(driver);
    Object.keys(pod_driver_map).forEach((key) => {
        if (pod_driver_map[key] === driver) {
            pod_id = key;
        }
    })
    console.log(pod_id);
    res.status(200).send(pod_id);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
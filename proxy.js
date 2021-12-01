const express = require('express');
const request = require('request');

var default_api_ip = '192.168.2.102';

var pod_driver_map = {};

var driver_nav_action_map = {
    'state': { 'input_action': 'api_action'},
    'NAV_MAIN_MENU': { 'leave': 'NAV_EXIT' },
    'NAV_MAIN_MENU': { 'go': 'NAV_RACE_MULTIPLAYER' },
    'NAV_EVENT': { 'leave': 'NAV_EXIT' },
    'NAV_EVENT': { 'go': 'NAV_TO_REALTIME' },
    'NAV_REALTIME': { 'leave': 'NAV_BACK_TO_EVENT' }
}

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
    let api_url = 'http://' + api_ip + ':' + port + '/rest/watch/sessionInfo';
    if (port == 52301) {console.log(api_url);}
    request(
        { url: api_url },
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
    let api_url = 'http://' + api_ip + ':' + port + '/rest/watch/standings';
    // console.log(api_url);
    request(
        { url: api_url },
        (error, response, body) => {
            if (error || response.statusCode !== 200) {
                return res.status(500).json({ type: 'error', message: error });
            }
            res.json(JSON.parse(body));
        }
    );
});

app.post('/clear-penalty', (req, res) => {
    let api_ip = req.query.ip || default_api_ip;
    let port = req.query.port;
    let driver_name = req.query.driver;
    let api_url = 'http://' + api_ip + ':' + port + '/rest/chat';
    // console.log(api_url);
    request.post({
        url:     api_url,
        body:    '/subpenalty 3 ' + driver_name
      }, function(error, response, body){
        console.log(body);
        res.status(200).send(body);
      });
});

app.post('/nav/dedi', (req, res) => {
    let api_ip = req.query.ip || default_api_ip;
    let port = req.query.port;
    let nav_action = req.query.action;
    let api_url = 'http://' + api_ip + ':' + port + '/navigation/action/' + nav_action;
    console.log(api_url);
    request.post({
        url:     api_url
      }, function(error, response, body){
        console.log(body);
        res.status(200).send(body);
      });
});

app.post('/nav/driver', (req, res) => {
    let driver_name = req.query.driver;
    let req_action = req.query.action;
    let port = 5397;
    let api_ip = req.query.ip || pod_ip(pod_id_from_driver(driver_name));
    // find current state as that can impact the action issued
    // plug the current state and the requested action into the map to get the nav action
    let nav_action = driver_nav_action_map[get_driver_state(driver_name).state.navigationState][req_action];
    let api_url = 'http://' + api_ip + ':' + port + '/navigation/action/' + nav_action;
    console.log(api_url);
    request.post({
        url: api_url
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
    res.status(200).send(pod_id_from_driver(req.query.driver));
});

function pod_ip(pod_id) {
    var last_octet = 0;
    var pod_int = length(pod_id) > 2 ? pod_id.substring(3) : pod_id;

    return '192.168.1.1' +  pod_int.length === 1  ? '0' + pod_int : pod_int;
}

function pod_id_from_driver(driver) {
    let pod_id = 0;
    Object.keys(pod_driver_map).forEach((key) => {
        if (pod_driver_map[key] === driver) {
            pod_id = key;
        }
    });
    return pod_id;
}

function get_driver_state(driver) {
    let port = 5397;
    let api_ip = req.query.ip || pod_ip(pod_id_from_driver(driver));
    request(
        { url: 'http://' + api_ip + ':' + port + '/navigation/state' },
        (error, response, body) => {
            if (error || response.statusCode !== 200) {
                return res.status(500).json({ type: 'error', message: error });
            }
            res.json(JSON.parse(body));
        }
    )
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
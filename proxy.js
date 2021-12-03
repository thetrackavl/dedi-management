const express = require('express');
const request = require('request');
const axios = require('axios');

var default_api_ip = '192.168.2.102';

var pod_driver_map = {};

var driver_nav_action_map = {
    'state': { 'input_action': 'api_action'},
    'NAV_MAIN_MENU': {
        'leave': 'NAV_EXIT',
        'go': 'NAV_RACE_MULTIPLAYER'
    },
    'NAV_EVENT': {
        'leave': 'NAV_EXIT',
        'go': 'NAV_TO_REALTIME'        
    },
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
    // console.log(api_url);
    axios.get(api_url, {timeout: 300})
    .then(resp => {
        // console.log(resp.data);
        res.json(resp.data);
    })
    .catch(err => {
        // Handle Error Here
        // console.error(err);
        return res.status(408).json({ type: 'error', message: err });
    });
});

app.get('/standings', (req, res) => {
    let api_ip = req.query.ip || default_api_ip;
    let port = req.query.port;
    let api_url = 'http://' + api_ip + ':' + port + '/rest/watch/standings';
    // console.log(api_url);
    axios.get(api_url, {timeout: 300})
    .then(resp => {
        // console.log(resp.data);
        res.json(resp.data);
    })
    .catch(err => {
        // Handle Error Here
        // console.error(err);
        return res.status(408).json({ type: 'error', message: err });
    });
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
    let driver_state = req.query.driver_state;
    let req_action = req.query.action;
    let driver_state_port = 5397;
    let driver_api_ip = req.query.ip || pod_ip(pod_id_from_driver(driver_name));

    console.log(driver_nav_action_map);
    console.log('trying for ' + driver_state + ' - ' + req_action);
    let nav_action = driver_nav_action_map[driver_state][req_action];
    let api_url = 'http://' + driver_api_ip + ':' + driver_state_port + '/navigation/action/' + nav_action;
    console.log(api_url);
    request.post({
        url: api_url
      }, function(error, response, body){
        console.log(body);
        res.status(200).send(body);
      });
});

app.get('/nav/driver', (req, res) => {
    let driver_state_port = 5397;
    let driver_api_ip = req.query.ip || pod_ip(pod_id_from_driver(req.query.driver));
    let driver_state_url = 'http://' + driver_api_ip + ':' + driver_state_port + '/navigation/state';
    axios.get(driver_state_url, {timeout: 300})
    .then(resp => {
        // console.log(resp.data);
        // console.log('driver state in call is ' + resp.data['state']['navigationState']);
        res.json(resp.data['state']['navigationState']);
    })
    .catch(err => {
        // Handle Error Here
        console.error(err);
        return res.status(408).json({ type: 'error', message: err });
    });
});

app.get('/nav/pod', (req, res) => {
    let driver_state_port = 5397;
    let driver_api_ip = req.query.ip || pod_ip(req.query.podid);
    let driver_state_url = 'http://' + driver_api_ip + ':' + driver_state_port + '/navigation/state';
    axios.get(driver_state_url, {timeout: 300})
    .then(resp => {
        // console.log(resp.data);
        // console.log('driver state in call is ' + resp.data['state']['navigationState']);
        res.json(resp.data['state']['navigationState']);
    })
    .catch(err => {
        // Handle Error Here
        // console.error(err);
        return res.status(408).json({ type: 'error', message: err });
    });
});

app.get('/race/selection', (req, res) => {
    let race_selection_port = 5397;
    let driver_api_ip = req.query.ip || pod_ip(req.query.podid);
    let race_selection_url = 'http://' + driver_api_ip + ':' + race_selection_port + '/rest/race/selection';
    axios.get(race_selection_url, {timeout: 300})
    .then(resp => {
        // console.log(resp.data);
        // console.log('driver state in call is ' + resp.data['state']['navigationState']);
        res.json(resp.data);
    })
    .catch(err => {
        // Handle Error Here
        // console.error(err);
        return res.status(408).json({ type: 'error', message: err });
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
    var pod_int = pod_id.length > 2 ? pod_id.substring(3) : pod_id;

    pod_int = pod_int.length == 1  ? '0' + pod_int : pod_int

    return '192.168.1.1' +  pod_int;
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

const PORT = process.env.PORT || 3000;
var srv = app.listen(PORT, () => console.log(`listening on ${PORT}`));
srv.setTimeout(500);
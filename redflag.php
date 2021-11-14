# move to next weekend
# move to warmup
# pull state
# set order
# add laps

<?php

require 'db_conn.php';

$api_host = '192.168.2.102';
$api_port = 54351;
$api_url = 'http://'.$api_host.':'.$api_port;
$chat_endpoint = '/rest/chat';

#let's get to warmup
$session_state = GetSessionState();

while ($session_state != 'WARMUP') {
    GoToWarmup();
    sleep(3);
    $session_state = GetSessionState();
}


$mysqli = get_dbh();

$state_query = $mysqli->query(
    'SELECT
        driver_name,
        laps_completed,
        driver_position
    FROM
        red_flag_restart_info');

while ($row = $state_query->fetch_assoc()) {
    
    $current_state[$row['rig_id']][$row['parameter_name']] = $row['value_name'];
}





function SetGrid($driver_name,$position) {
    $chat_string = '/editgrid '.$position.' '.$driver_name;
    CallAPI('POST',$api_url.$chat_endpoint,$chat_string);
}

function SetLaps($driver_name,$laps) {
    $chat_string = '/changelaps '.$laps.' '.$driver_name;
    CallAPI('POST',$api_url.$chat_endpoint,$chat_string);
}

function GoToWarmup() {
    $session_endpoint = '/navigation/action/'
    $restart_weekend_action = 'NAV_RESTART_WEEKEND';
    $next_session_action = 'NAV_FINISH_SESSION';

    CallAPI('POST',$api_url.$session_endpoint.$restart_weekend_action);
    sleep(3);
    CallAPI('POST',$api_url.$session_endpoint.$next_session_action);
    sleep(3)
    CallAPI('POST',$api_url.$session_endpoint.$next_session_action);
}

function GetSessionState() {
    $session_status_endpoint = '/navigation/state'
    $session_query = CallAPI('GET',$api_url.$session_status_endpoint)
    $session_state = json_decode($session_query,true);

    return $session_state["state"]["gameSession"];
}

function CallAPI($method, $url, $data = false) {
    $curl = curl_init();

    switch ($method)
    {
        case "POST":
            curl_setopt($curl, CURLOPT_POST, 1);

            if ($data)
                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            break;
        case "PUT":
            curl_setopt($curl, CURLOPT_PUT, 1);
            break;
        default:
            if ($data)
                $url = sprintf("%s?%s", $url, http_build_query($data));
    }

    // Optional Authentication:
    curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    curl_setopt($curl, CURLOPT_USERPWD, "username:password");

    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

    $result = curl_exec($curl);

    curl_close($curl);

    return $result;
}
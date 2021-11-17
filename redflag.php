# move to next weekend
# move to warmup
# pull state
# set order
# add laps

<?php

require 'db_conn.php';

$dedi_id = $_POST['dedi_id'];

$mysqli = get_dbh();
$dedi_info_query = $mysqli->query(
    "SELECT
        dedi_id,
        dedi_ip,
        dedi_api_port
    FROM
        dedicated_servers
    WHERE
        dedi_id = $dedi_id");

$dedi_info = $dedi_info_query->fetch_assoc();

$api_host = $dedi_info['dedi_ip'];
$api_port = $dedi_info['dedi_api_port'];
$api_url = 'http://'.$api_host.':'.$api_port;
$chat_endpoint = '/rest/chat';

#let's get to warmup
$session_state = GetSessionState();

while ($session_state != 'WARMUP') {
    GoToWarmup();
    sleep(3);
    $session_state = GetSessionState();
}

$state_query = $mysqli->query(
    'SELECT
        driver_name,
        laps_completed,
        driver_position
    FROM
        red_flag_restart_info');

while ($row = $state_query->fetch_assoc()) {
    SetGrid($row["driver_name"],$row["position"]);
    SetLaps($row["driver_name"],$row["lapsCompleted"]);
}

#ready to start the race now





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

?>
<?php

$url = 'http://api.geonames.org/timezoneJSON?formatted=true&lat=' . $_REQUEST['postlat'] . '&lng=' . $_REQUEST['postlng'] .  '&username=malaika&style=full';

$ch = curl_init();
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);

$result=curl_exec($ch);

curl_close($ch);

$decode = json_decode($result,true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['data']['Sunrise'] = $decode['sunrise'];
$output['data']['Sunset'] = $decode['sunset'];

//$date("d/m/Y", strtotime($output['data']['Sunrise'] = $decode['sunrise']));

echo json_encode($output);

?>
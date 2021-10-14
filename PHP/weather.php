<?php

$url = 'http://api.geonames.org/findNearByWeatherJSON?formatted=true&lat=' . $_REQUEST['postlat'] . '&lng=' . $_REQUEST['postlng'] .  '&username=malaika&style=full';

$ch = curl_init();
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);

$result=curl_exec($ch);

curl_close($ch);

$decode = json_decode($result,true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['data'] = $decode['weatherObservation'];

//echo json_encode($output);
echo json_encode($output['data']['datetime']);
//[0].data.clouds
/*
$country_display = [];

foreach ($output['data'] as $array) {
    $country['dateTime'] = $array['datetime'];

    array_push($country_display, $country);
}

//echo $country_display;
echo json_encode($country_display);
*/
?>
<?php

$url = 'http://api.geonames.org/findNearbyWikipediaJSON?formatted=true&lat=' . $_REQUEST['postlat'] . '&lng=' . $_REQUEST['postlng'] . '&username=malaika&style=full';

$ch = curl_init();
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);

$result=curl_exec($ch);

curl_close($ch);

$decode = json_decode($result,true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['data'] = $decode['geonames'];

$country_display = [];

foreach ($output['data'] as $array) {
    $country['Title'] = $array['title'];
    $country['Wiki Link'] = $array['wikipediaUrl'];

    array_push($country_display, $country);
}

echo json_encode($country_display);

?>
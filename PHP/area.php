<?php

$url = 'http://api.geonames.org/findNearbyPlaceNameJSON?formatted=true&lat=' . $_REQUEST['postlat'] . '&lng=' . $_REQUEST['postlng'] .  '&username=malaika&style=full';

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
    $country['City'] = $array['adminName2'];
    $country['Area'] = $array['name'];
    $country['Population of Area'] = $array['population'];
    $country['More information'] = $array['alternateNames'][0]['name'];

    array_push($country_display, $country);
}

echo json_encode($country_display);

?>
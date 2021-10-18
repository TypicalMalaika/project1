<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$url = 'http://api.geonames.org/countryInfoJSON?formatted=true&lang=en&country=' . $_REQUEST['countryCode'] . '&username=malaika&style=full';

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
    
    $country['Country Name'] = $array['countryName'];
    $country['Capital'] = $array['capital'];
    $country['Population'] = $array['population'];
    $country['Currency Code'] = $array['currencyCode'];

    array_push($country_display, $country);
}

echo json_encode($country_display);

?>
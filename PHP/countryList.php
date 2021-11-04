<?php

$strJsonFileContents = file_get_contents("../JS/countryBorders.geo.json");

$array  = json_decode($strJsonFileContents,true); 

$country_list = [];
foreach ($array['features'] as $feature) {
    
    $country['code'] = $feature['properties']["iso_a2"];
    $country['name'] = $feature['properties']['name'];
    array_push($country_list, $country);
}
$name = array_column($country_list, 'name');
array_multisort($name, SORT_ASC, $country_list);

echo json_encode($country_list);
?>
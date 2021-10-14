<?php

// Read the JSON file 
$strJsonFileContents = file_get_contents("../JS/countryBorders.geo.json");

// Decode the JSON file
$array  = json_decode($strJsonFileContents,true); 

$country_list = [];
foreach ($array['features'] as $feature) {
    
    $country['code'] = $feature['properties']["iso_a3"];
    $country['name'] = $feature['properties']['name'];
    array_push($country_list, $country);
}
echo json_encode($country_list);
?>
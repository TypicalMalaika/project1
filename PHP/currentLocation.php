<?php

$url = 'http://api.geonames.org/countryCode?lat=' . $_REQUEST['postlat'] . '&lng=' . $_REQUEST['postlng'] .'&username=malaika';

$ch = curl_init();
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);

$result=curl_exec($ch);

curl_close($ch);

$decode = json_decode($result,true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";

str_replace(array('\r', '\n'), '', $result);
$result = trim($result);

$strJsonFileContents = file_get_contents("../JS/countryBorders.geo.json");
    $array  = json_decode($strJsonFileContents,true); 

    foreach($array["features"] as $feature){
        if($feature ['properties']["iso_a2"] == $result){ 
            echo json_encode ($feature);
            break;
        }
    }


?>
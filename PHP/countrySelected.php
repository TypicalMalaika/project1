<?php

$strJsonFileContents = file_get_contents("../JS/countryBorders.geo.json");
    $array  = json_decode($strJsonFileContents,true); 

    $countryChosen = $_POST['countryChosen'];
    foreach($array["features"] as $feature){
        if($feature ['properties']["iso_a3"] == $countryChosen){ 
            echo json_encode($feature);
            break;
        }
    }

?>
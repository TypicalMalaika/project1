window.onload = function () {

    var myMap = L.map('map').setView([0, 0], 1);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(myMap);

    let lat = null;
    let lng = null;

    navigator.geolocation.getCurrentPosition(function (position) {
        //finds current user location
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        //shows current location
        //var currrentLocation = myMap.locate({ setView: [lat, lng], maxZoom: 10 })
        $.post('./PHP/currentLocation.php', { postlat: lat, postlng: lng },
            function (data) {
                //data = data.substring(0, data.length - 5) + '"';
                //console.log(data);
                result = JSON.parse("[" + data + "]");
                //console.log(result);
                geojsonLayer = L.geoJSON(result, {
                    style: function (feature) {
                        return { color: "#ff0000" };
                    },
                    onEachFeature: function (feature, layer) {
                        layer.myTag = "myGeoJSON"
                    }
                });
                geojsonLayer.addTo(myMap);
            });

    });

    $.ajax({
        url: './PHP/countryList.php',
        type: 'POST',
        data: {
            countryChosen: $('#countryChosen').val(),
        },

        success: function (result) {
            result = JSON.parse("[" + result + "]");
            result[0].forEach(myFunction)
            function myFunction(item) {
                var value = (item['code']);
                var label = (item['name']);
                var row = $('<option value="' + value + '">' + label + '</option>');
                $('#countryChosen').append(row);
            }
        },
        error: function () {
            console.log('error');
        }
    });

    $('#countrybtn').click(function () {

        $.ajax({
            url: './PHP/countrySelected.php',
            type: 'POST',
            data: {
                countryChosen: $('#countryChosen').val(),
            },
            success: function (result) {
                result = JSON.parse("[" + result + "]");
                //result = result['properties']['iso_a2'];
                var countryCode = (result[0]['properties']['iso_a2']);
                
                $.post('./PHP/countryInfo.php', { countryCode: countryCode },
                function (data) {
                    result = JSON.parse("[" + data + "]");

                });
                $.post('./PHP/wiki.php', { postlat: lat, postlng: lng },
                function (data) {
                    result = JSON.parse("[" + data + "]");

                });
                $.post('./PHP/weather.php', { postlat: lat, postlng: lng },
                function (data) {
                    console.log(data);
                    result = JSON.parse("[" + data + "]");
                    console.log(result);

                });

                //console.log(result);
                myMap.eachLayer(function (layer) {

                    if (layer.myTag && layer.myTag === "myGeoJSON") {
                        myMap.removeLayer(layer);
                    }

                });

                geojsonLayer = L.geoJSON(result, {

                    style: function (feature) {
                        return { color: "#ff0000" };
                    },
                    onEachFeature: function (feature, layer) {
                        layer.myTag = "myGeoJSON"
                    }
                    
                });
                geojsonLayer.addTo(myMap).bindPopup('hi'); //change pop up




            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(errorThrown, textStatus);
            }
        });
        return false;
    });

    $('#test').click(function () {
        var popup = L.popup()
            .setLatLng(latlng)
            .setContent('<p>Hello world!<br />This is a nice popup.</p>')
            .openOn(myMap);
    })



    /*
     L.easyButton('fa-gbp', function () {
         map.setView([55, -2], 4);
     }).addTo(myMap)
 */

}
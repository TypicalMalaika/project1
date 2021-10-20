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
                result = JSON.parse("[" + data + "]");
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

    $("#countryChosen").on("change", function (e) {

        $.ajax({
            url: './PHP/countrySelected.php',
            type: 'POST',
            data: {
                countryChosen: $('#countryChosen').val(),
            },
            success: function (result) {
                result = JSON.parse("[" + result + "]");
                var countryCode = (result[0]['properties']['iso_a2']);
                var modalLeft = []
                var something = []
                $.post('./PHP/countryInfo.php', { countryCode: countryCode },
                    function (data) {
                        result = JSON.parse("[" + data + "]");
                        result = result[0][0];
                        displayInfo('#countryInfo');
                    });


                $.post('./PHP/wiki.php', { postlat: lat, postlng: lng },
                    function (data) {
                        result = JSON.parse("[" + data + "]");
                        answer = result[0]; //changing variables for ease of use
                        for (var x = 0; x < answer.length; x++) {
                            result = answer[x];
                            displayInfo('#wiki');
                        }
                    });

                $.post('./PHP/weather.php', { postlat: lat, postlng: lng },
                    function (data) {
                        result = JSON.parse("[" + data + "]");
                        result = (result[0]['data']);
                        displayInfo('#weather');
                    });
                $.post('./PHP/timeZone.php', { postlat: lat, postlng: lng },
                    function (data) {
                        result = JSON.parse("[" + data + "]");
                        result = (result[0]['data']);
                        displayInfo('#timeZone');
                    });
                $.post('./PHP/area.php', { postlat: lat, postlng: lng },
                    function (data) {
                        result = JSON.parse("[" + data + "]");
                        result = (result[0][0]);
                        displayInfo('#area');
                    });

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

                function displayInfo(tableId) {
                    for (const [key, value] of Object.entries(result)) {
                        var row = $('<tr><td><b>' + key + '</b>: ' + value + '</td> + <td>');
                        $(tableId).append(row);
                    }
                }
                geojsonLayer.addTo(myMap);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(errorThrown, textStatus);
            }
        
        });
        //here
        return false;
    });

    
var myvar = '<div>'+
'                    <table>'+
'                        <th>Country Information</th>'+
'                        <tr id=\'countryInfo\'>'+
'                        </tr>'+
'                    </table>'+
'                    <br>'+
'                    <table>'+
'                        <th>Weather</th>'+
'                        <tr id=\'weather\'>'+
'                        </tr>'+
'                    </table>'+
'                    <br>'+
'                    <table>'+
'                        <th>Time Zone</th>'+
'                        <tr id=\'timeZone\'>'+
'                        </tr>'+
'                    </table>'+
'                    <br>'+
'                    <table>'+
'                        <th>Area</th>'+
'                        <tr id=\'area\'>'+
'                        </tr>'+
'                    </table>'+
'                    <br>'+
'                    <table>'+
'                        <th>Wiki Links</th>'+
'                        <tr id=\'wiki\'>'+
'                        </tr>'+
'                    </table>'+
'                </div>';


    var modal = document.getElementById("myModal");
    var btn = document.getElementById("myBtn");
    var span = document.getElementsByClassName("close")[0];
    btn.onclick = function () {
        modal.style.display = "block";
    }

    span.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    
    var helloPopup = L.popup().setContent(myvar);

    L.easyButton('fas fa-globe', function(btn, map){
        helloPopup.setLatLng(map.getCenter()).openOn(map);
    }).addTo(myMap);

    

    //myMap.on('click', function(e) {
    //  alert("hello");
    //});

    /*

    $('#test').click(function () {
        var popup = L.popup()
            .setLatLng(latlng)
            .setContent('<p>Hello world!<br />This is a nice popup.</p>')
            .openOn(myMap);
    })

    
     L.easyButton('fa-gbp', function () {
         map.setView([55, -2], 4);
     }).addTo(myMap)
 */

}
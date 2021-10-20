window.onload = function () {

    var myMap = L.map('map').setView([0, 0], 1);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(myMap);

    let lat = null;
    let lng = null;

    navigator.geolocation.getCurrentPosition(function (position) {
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        var currrentLocation = myMap.locate({ setView: [lat, lng], maxZoom: 10 })
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
                        answer = result[0];
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
        return false;
    });

    L.easyButton('fas fa-globe', function () {
        modal.style.display = 'block';
    }).addTo(myMap);

    const modal = document.querySelector('#my-modal');
    const closeBtn = document.querySelector('.close');

    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', outsideClick);

    function openModal() {
        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    function outsideClick(e) {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    }
}
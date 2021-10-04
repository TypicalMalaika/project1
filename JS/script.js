window.onload = function () {

    var map = L.map('map').setView([0, 0], 1);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    navigator.geolocation.getCurrentPosition(function (position) {
        //finds current user location
        let lat = position.coords.latitude;
        let long = position.coords.longitude;
            
        //shows current location
        var currrentLocation = map.locate({ setView: [lat, long], maxZoom: 10 })
    });

    function helloButton() {
        $.ajax({
            url: 'PHP/countryBorders.geo.json',
            type: 'POST',
            dataType: 'json',
            data: {
            },
            success: function (result) {
                alert("Worked!")
                
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(errorThrown);
            } 
        });
    };
}
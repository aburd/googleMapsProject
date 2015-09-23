  var map;
  var resBox = document.getElementById('res'),
      resMaps = document.getElementById('maps-data');
  var mapData;


  function initMap() {
    var geocoder = new google.maps.Geocoder;


      function getCoords( address, callback ){
        var coordinates;
        geocoder.geocode({ address:address }, function(results, status){
          coordinates = results;
          resBox.innerHTML = coordinates[0].geometry.location.H + ", " + coordinates[0].geometry.location.L;

          callback( coordinates );
        });
      }

      getCoords('Tokyo, Japan', function(coords){
        map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: coords[0].geometry.location.H, lng: coords[0].geometry.location.L },
          zoom: 12
        });

        $.get("servcorp-worldwide-locations.json", function(data){

          data.Tokyo.forEach(function(location, index){
            resMaps.innerHTML += location.BuildingName + ' ' + location.Latitude + ', ' + location.Longitude + '<br><br>';
            var latlng = new google.maps.LatLng(location.Latitude, location.Longitude);
          
            var marker = new google.maps.Marker({
              position: latlng,
              map: map,
              name: location.BuildingName
            });
          });

        window.tester = function(){ console.log(data.Tokyo)};
        }, "json");
      });

  }





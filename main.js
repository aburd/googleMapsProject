var map;
var resBox = document.getElementById('res'),
    resMaps = document.getElementById('maps-data');
var mapData;
var markers = [];


  // Start map
  function initMap() {
    var geocoder = new google.maps.Geocoder;
    var infoWindow = new google.maps.InfoWindow();
    var latLngBounds = new google.maps.LatLngBounds();
    
    // Get coordinated from geocoding
    function getCoords( address, callback ){
      var coordinates;
      geocoder.geocode({ address:address }, function(results, status){
        coordinates = results;
        resBox.innerHTML = coordinates[0].geometry.location.H + ", " + coordinates[0].geometry.location.L;

        callback( coordinates );
      });
    }

    // Set coordinated from geocoded location
    getCoords('Tokyo, Japan', function(coords){
      map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: coords[0].geometry.location.H, lng: coords[0].geometry.location.L },
        zoom: 12
      });

      // Get JSON data
      $.get("servcorp-worldwide-locations.json", function(data){
        mapData = data;

        makeAreaMap('Tokyo');
        makeAreaMap('Yokohama');
        makeAreaMap('Osaka');
        makeAreaMap('Nagoya');
        makeAreaMap('Fukuoka');

        function makeAreaMap(area){

          // Start data loop from JSON data
          data[area].forEach(function(location, index){
            resMaps.innerHTML += location.BuildingName + ' ' + location.Latitude + ', ' + location.Longitude + '<br><br>';
            var latlng = new google.maps.LatLng(location.Latitude, location.Longitude);
          
            // Make markers, one for each iteration
            var marker = new google.maps.Marker({
              position: latlng,
              map: map,
              name: location.BuildingName
            });

            // Set click function for each marker
            google.maps.event.addListener(marker, 'click', function(){
                map.panTo(latlng);
                    
                /* Info Window */
                var content = "<p class='map-popup'><img src='" + location.ThumbnailUrl + "' alt='" + location.ThumbnailAlias + "' width='70' /><span>" + location.Address + "<br><a href='" + location.BuildingUrl + "'> " + location.BuildingName + " &raquo;</a> </span></p>";
                    
                infoWindow.setContent(content);                    
                infoWindow.setPosition(latlng);
                infoWindow.open(map);

            });
            markers.push(marker);

            // Set bounds of the viewport
            latLngBounds.extend(new google.maps.LatLng(location.Latitude, location.Longitude));
            map.fitBounds(latLngBounds);

          });
        }
        
      window.tester = function(){ console.log(data.Tokyo)};
      }, "json");
    });

    $('div.location', 'ul#place-list').click(function(){
      var area = $(this).attr('data-place');
      console.log(typeof area);
      changeArea(mapData, area);
      console.log('working...');
    });

    // function to call on Area click
    function changeArea(data, areaName) {
      var latLngBounds = new google.maps.LatLngBounds;

      data[areaName].forEach(function(location, index){
        latLngBounds.extend(new google.maps.LatLng(location.Latitude, location.Longitude ));
      });
      map.fitBounds(latLngBounds);    
    }

  }





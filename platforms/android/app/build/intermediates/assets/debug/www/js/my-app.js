var myApp = new Framework7();
var $$ = Dom7;

var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
});

$$(document).on('deviceready', function() {
  checkPermissions();
  $$(".menulist").click(function(){
    $$($$(".menuactive")[0]).removeClass("menuactive")
    $$(this).addClass('menuactive');
  });
});

myApp.onPageInit('index', function (page) {
  checkPermissions();
  $$($$(".menuactive")[0]).removeClass("menuactive")
  $$("#mapamenu").addClass('menuactive');
});

function checkPermissions(){
  var permissions = cordova.plugins.permissions;
  permissions.checkPermission(permissions.ACCESS_COARSE_LOCATION, function(status){
    if (!status.hasPermission) {
      permissions.requestPermission(permissions.ACCESS_COARSE_LOCATION, successlocation, errorlocation);
    }else{
      start();
    }
  });
}

function errorlocation() {
  myApp.alert('Necesitamos tener acceso a tu ubicación con el fin de recomendarte entretenimiento cercano a ti', 'BigBonos');
}

function successlocation(status) {
  if(!status.hasPermission){
    errorlocation();
  }else {
    start();
  }
}

function start(){
  navigator.geolocation.getCurrentPosition(onSuccess, errorlocation);
}

function onSuccess(position) {
  var map;
  var service;
  initMap();

  function initMap() {
    var mapCenter = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
    map = new google.maps.Map(document.getElementById('map'), {
                center: mapCenter,
                zoom: 13
              });
              var marker = new google.maps.Marker({
                      position: mapCenter,
                      map: map,
                      title: 'my location'
                  });

                  var request = {
                    location: mapCenter,
                    radius: '100000',
                    query: 'Big Bola Casinos'
                  };

                  infowindow = new google.maps.InfoWindow();
                  service = new google.maps.places.PlacesService(map);
                  service.textSearch(request, callback);

              var features = [
                {position: new google.maps.LatLng(19.3772266,-99.2566899)},
                {position: new google.maps.LatLng(19.3778799,-99.2575666)},
                {position: new google.maps.LatLng(19.3683856,-99.2633981)},
                {position: new google.maps.LatLng(19.3671767,-99.2626293)},
                {position: new google.maps.LatLng(19.3686164,-99.2598274)},
                {position: new google.maps.LatLng(19.3585457,-99.275006)},
                {position: new google.maps.LatLng(19.3585904,-99.290327)},
                {position: new google.maps.LatLng(19.404726,-99.2428997)},
                {position: new google.maps.LatLng(19.3598272,-99.2767364)},
                {position: new google.maps.LatLng(19.403147,-99.1563406)},
                {position: new google.maps.LatLng(19.4360812,-99.074097)},
                {position: new google.maps.LatLng(19.5376804,-99.2111689)},
                {position: new google.maps.LatLng(19.4141225,-99.2658442)},
                {position: new google.maps.LatLng(20.5754735,-100.4067534)},
                {position: new google.maps.LatLng(20.5777584,-100.4077649)},
                {position: new google.maps.LatLng(20.6745746,-100.4385359)},
                {position: new google.maps.LatLng(20.5741491,-100.4114937)},
                {position: new google.maps.LatLng(20.6145233,-100.389903)},
                {position: new google.maps.LatLng(20.5363049,-100.4365511)},
                {position: new google.maps.LatLng(20.5499543,-100.4263806)},
                {position: new google.maps.LatLng(20.5855821,-100.383768)},
                {position: new google.maps.LatLng(20.5630371,-100.3760351)},
                {position: new google.maps.LatLng(20.6757397,-100.4331266)}
              ];
              features.forEach(function(feature) {
                var marker = new google.maps.Marker({
                  position: feature.position,
                  icon: {
                    url: 'img/moneda.png'
                  },
                  map: map
                });
              });

              function callback(results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                  for (var i = 0; i < results.length; i++) {
                    var place = results[i];
                    addMarker(results[i]);
                  }
                }
              }

              function addMarker(place) {
                var types = place.types;
                if (types.includes("casino")){
                var marker = new google.maps.Marker({
                  map: map,
                  position: place.geometry.location,
                  icon: {
                    url: 'img/bola.png'
                  }
                });
                google.maps.event.addListener(marker, 'click', function() {
                  infowindow.setContent(place.name);
                  infowindow.open(map, this);
                });
              }
            }
  }
}

myApp.onPageInit('contacto', function (page) {
  $$("#myform").submit(function(e) {
    e.preventDefault();
    var datos = [];
    datos.push($$("#nombre").val(), $$("#correo").val(), $$("#asunto").val(), $$("#mensaje").val());
    $$.ajax({
      method: "POST",
      url: "http://apps.opion-tech.com/correoBigBonos.php",
      contentType: "application/x-www-form-urlencoded",
      data: {
        data: datos
      },
      beforeSend: function() {
        $$("#myform").hide();
        $$(".contenido").append("<div id='loading' style='text-align: center'><span style='width:42px; height:42px' class='preloader'></span><h4>Espera por favor...</h4></div>");
      },
      success: function(response) {
        myApp.alert("El correo se envió exitosamente", "BigBola");
        $$("#myform")[0].reset();
      },
      error: function(error) {
        myApp.alert("Ocurrió un error, intenta de nuevo", "BigBola");
      },
      complete: function() {
        $$("#loading").remove();
        $$("#myform").show();
      }
    });
  });
});

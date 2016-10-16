'use strict';

(function() {
  var latitude = 23.69781;
  var longitude = 120.96051499999999;

  setLocation(latitude, longitude);
  navigator.geolocation.getCurrentPosition(function(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    setLocation(latitude, longitude, function(location) {
      latitude = location.latitude;
      longitude = location.longitude;
    });
  });

  $('#add').click(function() {
    $.ajax({
      method: 'post',
      url: 'http://' + SERVER_ADDRESS + '/devices',
      data: {
        lng: longitude,
        lat: latitude,
        description: $('#description').val(),
        email: $('#email').val(),
        name: $('#name').val()
      }
    })
    .done(function(data) {
      if (data.result === 'success') {
        window.location = 'flash.html?id=' + data.id;
      } else {
        alert(data.message);
      }
    });
  });

  function setLocation(latitude, longitude, onchanged) {
    onchanged = onchanged || function() {};
    $('#map').locationpicker({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      radius: 0,
      onchanged: onchanged
    });
  }
}());

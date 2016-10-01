'use strict';

(function() {
  var params = new URLSearchParams(window.location.search);
  var deviceId = params.get('id');
  $.ajax({
    url: 'http://' + SERVER_ADDRESS + '/devices/' + deviceId + '/data'
  })
  .done(function(data) {
    drawChart(data);
  });

  var editor = ace.edit('editor');
  editor.getSession().setMode("ace/mode/javascript");

  function drawChart(_data) {
    var data = convertData(_data);
    var ctx = document.querySelector('#chart');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.date,
        datasets: data.datasets
      },
      options: {
        legend: {
          display: false
        },
        responsive: true,
        scales:{
          xAxes: [{
            display: false
          }],
          yAxes: [{
            display: true,
            ticks: {
              suggestedMin: 0
            }
          }]
        }
      }
    });
  }

  function convertData(_data) {
    var date = [];
    var datasets = [];

    if (Array.isArray(_data) && _data[0]) {
      var keys = Object.keys(_data[0].data);

      keys.forEach(function() {
        datasets.push({ data: [] });
      });

      _data.forEach(function(item) {
        date.push(new Date(item.date));
        keys.forEach(function(key, i) {
          datasets[i].data.push(item.data[key]);
        });
      });
    }

    return {
      date: date,
      datasets: datasets
    };
  }
}());

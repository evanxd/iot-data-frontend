'use strict';

(function() {
  var DATA_FROM_DB;
  var editor = ace.edit('editor');
  var params = new URLSearchParams(window.location.search);
  var deviceId = params.get('id');
  $.ajax({
    url: 'http://' + SERVER_ADDRESS + '/devices/' + deviceId + '/data'
  })
  .done(function(data) {
    DATA_FROM_DB = data;
    Object.freeze(DATA_FROM_DB);

    editor.getSession().setMode("ace/mode/javascript");
    editor.commands.addCommand({
      bindKey: { mac: 'Command-Z', win: 'Ctrl-Z' },
      exec: drawChart
    });
    drawChart();
  });

  function drawChart() {
    var data;

    try {
      var code = editor.getSession().getValue();
      eval(code);
      // Clone the array data.
      data = DATA_FROM_DB.slice(0);
      data = query(data) || [];
      window.query = undefined;
    } catch(err) {
      alert(err);
      throw err;
    }

    data = convertData(data);
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

  function convertData(data) {
    var date = [];
    var datasets = [];

    if (Array.isArray(data) && data[0]) {
      var keys = Object.keys(data[0].data);

      keys.forEach(function() {
        datasets.push({ data: [] });
      });

      data.forEach(function(item) {
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

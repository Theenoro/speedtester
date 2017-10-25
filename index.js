#!/usr/local/bin/node
console.log('---------------')
console.log(Date());
console.log('---------------')
console.log('Start Speedtest');
const os = require('os')
const {  spawn } = require('child_process');
const fs = require('fs');
const sp = spawn('speedtest-cli', []);

var this_os = os.platform();


var html = `
<script src="https://code.jquery.com/jquery-3.2.1.min.js">
</script>
<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
<div id="chart_div"></div>
<script>
  $(function() {
    var data = shiet;
    var rows = [];
    for (var i = 0; i < data.sets.length; i++) {
      var date = new Date(data.sets[i].time * 1000);
      var hours = date.getHours();
      var minutes = "0" + date.getMinutes();
      var seconds = "0" + date.getSeconds();
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();
      var formattedTime = day + '.' + month + '.' + year + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
      rows.push([
        date,
        formattedTime + "<ul><li>Download: " + data.sets[i].download + " mbit/s </li><li>Upload: " + data.sets[i].upload + " mbit/s </li><li>Ping: " + data.sets[i].ping + " ms</li></ul>",
        data.sets[i].download,
        data.sets[i].upload,
        data.sets[i].ping
      ])
    }
    google.charts.load('current', {
      packages: ['corechart', 'line']
    });
    google.charts.setOnLoadCallback(drawCurveTypes);

    function drawCurveTypes() {
      var data = new google.visualization.DataTable();
      data.addColumn('date', 'X');
      data.addColumn({
        'type': 'string',
        'role': 'tooltip',
        'p': {
          'html': true
        }
      });
      data.addColumn('number', 'Download');
      data.addColumn('number', 'Upload');
      data.addColumn('number', 'Ping');
      data.addRows(rows);
      var options = {
        hAxis: {
          title: 'Time',
        },
        vAxes: {0: {viewWindowMode:'explicit',
                title: 'mbit/s',
                format:"#mbit/s",
                viewWindow:{ min: 0 }
            },
            1: {
                format:"#ms",
                title: 'ping',
                viewWindow:{ min: 0 }
            },
        },
        series: {
          0: {
            curveType: 'function',
            targetAxisIndex:0
          },
          1: {
            curveType: 'function',
            targetAxisIndex:0
          },
          2: {
            curveType: 'function',
            targetAxisIndex:1
          }
        },
        explorer: {
          axis: 'horizontal',
          keepInBounds: true
        },
        legend: {
        },
        curveType: 'function',
        focusTarget: 'category',
        // Use an HTML tooltip.
        tooltip: {
          isHtml: true
        }
      };

      var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
      chart.draw(data, options);
    }
  })
</script>
`;
var out = [];
var end = {
  download: 0.00,
  upload: 0.00,
  ping: 0,
  time: 0
}
var datasheet = {'sets': []};
sp.stdout.on('data', (data) => {
  data = `${data}`;
  if(data == '.'){
  }else{
    console.log(data)
    out.push(`${data}`);
  }
});
sp.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});
sp.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
  if(`${code}` != 0){
    return;
  }
  for (var i = 0; i < out.length; i++) {
    if(this_os === 'win32'){
        if(out[i].match('Ping')){
            console.log('out')
            var m = out[i].split('Ping (Lowest): ')[1].split(' ms | Download (Max): ');
            var n = m[1].split(' Mbps | Upload (Max): ');
            end.upload = parseFloat(n[1].split(' Mbps'));
            end.download = parseFloat(n[0]);
            end.ping = parseInt(m[0]);
        }
    }else{
        if (out[i].match('Download')) {
          end.download = parseFloat(out[i].split('\n')[1].split(' ')[1]);
        } else if (out[i].match('Upload')) {
          end.upload = parseFloat(out[i].split('\n')[1].split(' ')[1]);
        } else if (out[i].match('ms')) {
          end.ping = parseInt(out[i].split('km]:')[1].split('ms')[0].trim());
        }
    }
  }
  end.time = parseInt(Date.now() / 1000);
  console.dir(end);
  fs.readFile(__dirname + '/datasheet.json', 'utf8', function(err, data) {
    if (!err) {
      try{
          datasheet = JSON.parse(data);
      }catch(e){
          datasheet = {'sets': []};
      }
    }
    datasheet.sets.push(end);
    fs.writeFile(__dirname + '/datasheet.json', JSON.stringify(datasheet), function(err) {
      if (err) {
        return console.log(err);
      }
      fs.writeFile(__dirname + '/table.html', html.replace('shiet', JSON.stringify(datasheet)), function(err) {
        if (err) {
          return console.log(err);
        }
        console.log("The HTML file was saved!");
      })
    });
  });
});

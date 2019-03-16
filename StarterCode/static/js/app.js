// HW15_env
// ===========METADATA===========
function buildMetadata(sample) {
  // var defaultURL = "/metadata/<sample>"
  var defaultURL = `/metadata/${sample}`
  keys = []
  values = []
  d3.json(defaultURL).then(function(data) {
    Object.entries(data).forEach(([key, value]) => {
      keys.push(key);
      values.push(value);
    });
  var entry = "<row>";
  for (var y = 0; y<keys.length; y++) {
    entry += `${keys[y]} : ${values[y]} <br/>`;
  }
  document.getElementById("sample-metadata").innerHTML = entry;
    });

};
// buildMetadata();
// ===========CHARTS===========
function buildCharts(sample) {
  var defaultURL = `/samples/${sample}`;

// =========== Makes arrays from JSON ===========
  d3.json(defaultURL).then(function(response) {
    // console.log(response);
  var sample_values = response.sample_values;
  var otu_ids = response.otu_ids;
  var otu_labels = response.otu_labels;

    const sizes = sample_values.map(value => {
      return value
    });

// ===========Makes scatter plot ===========
    var trace = {
      type: "scatter",
      mode: "markers",
      marker: {
        color : otu_ids,
        colorscale: 'Jet',
        size: sizes,
      },
      text: otu_labels,
      name: "Belly Button Biodiversity",
      x: otu_ids,
      y: sample_values,
    };

    var data = [trace];

    var layout = {
      title: "Belly Button Biodiversity",
      height: 600,
      width: 1400,
    xaxis: {
    title: {
      text: 'OTU IDs',
      font: {
        size: 18,
        color: '#7f7f7f'
      }
    },
  },
    yaxis: {
      title: {
        text: 'Sample Values',
        font: {
          size: 18,
          color: '#7f7f7f'
      }
     }
   }
 };

    // console.log(trace.x);
Plotly.newPlot("bubble", data, layout);

// ======= Trying to sort and slice =======
var array = []
var sample_vals = response.sample_values;
var sample_id = response.otu_ids;
var sample_label = response.otu_labels;

   for (var j = 0; j < sample_id.length; j++) {
     array.push({'sample_values': sample_vals[j], 'otu_ids': sample_id[j], 'otu_labels': sample_label[j]}
   )};
  //  console.log(array)
   var sorted = array.sort(function(a, b) {
   // var sorted = data.sort(function(a, b) {
     return parseFloat(b.sample_values) - parseFloat(a.sample_values);
   });
   sorted.sort();
   // Slice the first 10 objects for plotting
   sorted = sorted.slice(0, 10);
   // Reverse the array due to Plotly's defaults
   sorted = sorted.reverse();
   console.log(sorted);


// ===========Makes Pie Chart SORTED ===========

var p_trace = [{
     values: sorted.map(row => row.sample_values),
     labels: sorted.map(row => row.otu_ids),
     hovertext: sorted.map(row => row.otu_labels),
     type: "pie",
     name: "Data Subset"
   }];

var p_layout = {
    height: 600,
    width: 600,
    title: "10 Most Found Bacteria",
    colorway: 'Jet',
    };

Plotly.newPlot("pie", p_trace, p_layout)

// // ======= Washing Freq Gauge ========

// // Enter a speed between 0 and 180
// var level = 175;

// // Trig to calc meter point
// var degrees = 180 - level,
//      radius = .5;
// var radians = degrees * Math.PI / 180;
// var x = radius * Math.cos(radians);
// var y = radius * Math.sin(radians);

// // Path: may have to change to create a better triangle
// var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
//      pathX = String(x),
//      space = ' ',
//      pathY = String(y),
//      pathEnd = ' Z';
// var path = mainPath.concat(pathX,space,pathY,pathEnd);

// var data = [{ type: 'scatter',
//    x: [0], y:[0],
//     marker: {size: 28, color:'850000'},
//     showlegend: false,
//     name: 'speed',
//     text: level,
//     hoverinfo: 'text+name'},
//   { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
//   rotation: 90,
//   text: ['8-9', '7-8', '6-7', '5-6',
//             '4-5', '3-4', '2-3', '1-2', '0-1', ''],
//   textinfo: 'text',
//   textposition:'inside',
//   marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
//                          'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
//                          'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
//                          'rgba(255, 255, 255, 0)']},
//   labels: ['151-180', '121-150', '91-120', '61-90', '31-60', '0-30', ''],
//   hoverinfo: 'label',
//   hole: .5,
//   type: 'pie',
//   showlegend: false
// }];

// var layout = {
//   shapes:[{
//       type: 'path',
//       path: path,
//       fillcolor: '850000',
//       line: {
//         color: '850000'
//       }
//     }],
//   title: 'Washing Frequency',
//   height: 400,
//   width: 400,
//   xaxis: {zeroline:false, showticklabels:false,
//              showgrid: false, range: [-1, 1]},
//   yaxis: {zeroline:false, showticklabels:false,
//              showgrid: false, range: [-1, 1]}
// };

// Plotly.newPlot('gauge', data, layout);

  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

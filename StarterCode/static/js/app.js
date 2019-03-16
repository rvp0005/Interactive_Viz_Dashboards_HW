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

  otu_ids = []
  otu_labels = []
  sample_values = []

// =========== Makes arrays from JSON ===========
  d3.json(defaultURL).then(function(response) {
    // console.log(response);
    otu_ids.push(response.otu_ids);
    otu_labels.push(response.otu_labels);
    sample_values.push(response.sample_values);

    const sizes = sample_values[0].map(value => {
      return value
    });

    // console.log(sample_values);
    var labels = otu_labels[0];

// ===========Makes scatter plot ===========
    var trace = {
      type: "scatter",
      mode: "markers",
      marker: {
        color : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80],
        colorscale: 'Jet',
        cmin: 0,
        cmax: 163,
        size: sizes,
      },
      text: labels,
      name: "Belly Button Biodiversity",
      x: otu_ids[0],
      y: sample_values[0],
    };

    var data = [trace];

    var layout = {
      title: "Belly Button Biodiversity",
      height: 600,
      width: 1500,
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

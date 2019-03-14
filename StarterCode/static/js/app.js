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
  var entry = "<hr/>";
  for (var y = 0; y<keys.length; y++) {
    entry += `${keys[y]} : ${values[y]} <br/>`;
  }
  document.getElementById("sample-metadata").innerHTML = entry;
    });

};
// buildMetadata();

function buildCharts(sample) {
  var defaultURL = `/samples/${sample}`;

  otu_ids = []
  otu_labels = []
  sample_values = []

  d3.json(defaultURL).then(function(response) {
    // console.log(response);
    otu_ids.push(response.otu_ids);
    otu_labels.push(response.otu_labels);
    sample_values.push(response.sample_values);

    const sizes = sample_values[0].map(value => {
      return value/2
    })  
    
    console.log(sample_values)
    console.log(sizes)

    var trace = {
      type: "scatter",
      mode: "markers",
      marker: {
        color : 'red',
        size: sizes,
        minsize = 1
      },
      name: "Belly Button Biodiversity",
      x: otu_ids[0],
      y: sample_values[0],
    };

    var data = [trace];

    var layout = {
      title: "Belly Button Biodiversity",
      height: 600,
      width: 1200
    };

    // console.log(trace.x);
    Plotly.newPlot("bubble", data, layout)
  });

 };


  // console.log(otu_labels)
//   trace = go.Scatter(
//     x = otu_ids,
//     y = sample_values)
//     data = [trace]
//     py.iplot(data, filename = 'bubblechart')

// };


    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
//     // otu_ids, and labels (10 each).
// }

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

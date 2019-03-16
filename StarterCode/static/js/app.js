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

// ===========Makes Pie Chart ===========
    var labels= otu_labels[0].slice(0,10);
    // console.log(labels);
    var values = sample_values[0].slice(0,10);
    // console.log(values);
    var ID = otu_ids[0].slice(0,10);
    // console.log(ID);

    var trace1 = [{
      values: values,
      labels: ID,
      type: 'pie',
      name: 'Data Subset',
      text: labels,
      textinfo: 'percent',
      hoverinfo:("text"+"labels"+"percent"),
    }];

    var layout1 = {
    height: 600,
    width: 600,
    title: "10 Most Found Bacteria"
    };

    Plotly.newPlot("pie", trace1, layout1)

// ======= Trying to sort and slice =======



  });
};


    // pie_values.sort(function(a, b) {
    //   return ((a.sample_values[0] < b.sample_values[0]) ? -1 : 
    //   ((a.sample_values[0] == b.sample_values[0]) ? 0 : 1));
    // });
    // console.log(sample_values[0])

    // for (var k = 0; k < pie_values.length; k++) {
    //   otu_ids[k] = pie_values[k].otu_ids;
    //   otu_labels[k] = pie_values[k].otu_labels;
    //   sample_values[k]= pie_values[k].sample_values;

    // console.log(sample_values)




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

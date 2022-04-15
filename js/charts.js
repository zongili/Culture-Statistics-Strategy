function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.csv("/js/culture_table.csv").then((data) => {
    var sampleNames = data;
    // console.log("csv file:", sampleNames[0]);
    sampleNames.forEach(function(d) {
      d["2010"] = +d["2010"];
      d["2011"] = +d["2011"];
      d["2012"] = +d["2012"];
      d["2013"] = +d["2013"];
      d["2014"] = +d["2014"];
      d["2015"] = +d["2015"];
      d["2016"] = +d["2016"];
      d["2017"] = +d["2017"];
      d["2018"] = +d["2018"];
      d["2019"] = +d["2019"];

    });
    // console.log("----sample names subdomain: ", sampleNames["Subdomain"])  
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample["Subdomain"])
        .property("value", sample["Subdomain"]);
    });
    // console.log("subdomain: ", sampleNames[0].Subdomain)
    // Use the first sample from the list to build the initial plots
    buildCharts(sampleNames[0].Subdomain);
  });
}

// Initialize the dashboard
init();

function optionChanged(dataSelected) {
  // Fetch new data each time a new sample is selected
  //buildMetadata(newSample);
  // console.log(dataSelected)
  buildCharts(dataSelected);
}

//  Create the buildCharts function.
function buildCharts(dataSelected) {
  //  Use d3 to load and retrieve the file 
  d3.csv("/js/culture_table.csv").then((data) => {

    // console.log("selected:", dataSelected)
    // record each record (header and value)
    var results = data.filter(d => d.Subdomain === dataSelected)
    // console.log('results: ', results)

// column names are the years
    years = Object.keys(results[0])
    GDP = Object.values(results[0])
    years = years.slice(0,10).map(d => parseInt(d))
    // exclude last two column keep the years and gdp values
    GDP = GDP.slice(0,10).map(d => parseInt(d))
    // console.log('years: ', years)
    // console.log('gdp: ', GDP)
    // console.log('max: ', Math.max(...GDP))
// size of the buble linked to gdp value
    size = GDP.slice(0,10).map(d => (parseFloat(d)/Math.max(...GDP)) * 50)
    console.log(size)
// prepare the trace and the layout for the plotting
    var trace = {
      x: years,
      y: GDP,
      mode: "markers",
      marker:{
        size: size
      } 
    }

    var data = [trace]

    layout = {
      title: `Domain: ${results[0]["Domain"]} ** Subdomain: ${dataSelected}`,
      xaxis: {title: "YEARS"},
      yaxis: {title: "GDP"}
    }

    Plotly.newPlot("bubble",data, layout)
  });
}

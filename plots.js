function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  })}
  
init();


function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
}

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      PANEL.append("h6").text("ID: " + result.id);
      PANEL.append("h6").text("Ethnicity: " + result.ethnicity);
      PANEL.append("h6").text("Gender: " + result.gender);
      PANEL.append("h6").text("Age: " + result.age);
      PANEL.append("h6").text("Location: " + result.location);
      PANEL.append("h6").text("BBtype: " + result.bbtype);
      PANEL.append("h6").text("WFreq: " + result.wfreq);
    });
}

function buildCharts(newSample) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var resultsArray = samples.filter(sampleObj => sampleObj.id == newSample);
        console.log(resultsArray)
        var result = resultsArray[0];
        console.log(result);
        var sortedValues = result.sample_values.sort((a,b) => a - b).reverse();
        console.log(sortedValues);
        var topTenValues = sortedValues.slice(0,10);
        console.log(topTenValues);

        var otu_ids = result.otu_ids.slice(0,10);
        console.log(otu_ids);
        var graph_labels = otu_ids.map((id) => "OTU " + String(id));
        console.log(graph_labels);

        var hover = result.otu_labels.slice(0,10);

        var trace = [{
            x: topTenValues,
            y: graph_labels,
            type: "bar",
            orientation: "h",
            text: hover
        }];

        var layout = {
            xaxis: { title: "Number of Bacteria"},
            yaxis: { title: "Type of Bacteria"}
        };

        Plotly.newPlot("bar", trace, layout);




        var bubbleTrace = [{
            x: result.otu_ids,
            y: result.sample_values,
            mode: 'markers',
            text: result.otu_labels,
            marker: {
                size: result.sample_values,
                color: result.otu_ids
            }
        }];

        Plotly.newPlot("bubble", bubbleTrace);
    });
    
}
optionChanged(940);

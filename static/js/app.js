// Fetch the JSON data
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {

    // Function to build the charts and display the metadata
    function buildCharts(id) {
        // Filter the data for the selected sample
        var individual = data.samples.filter(sample => sample.id === id)[0];
        var metadata = data.metadata.filter(meta => meta.id.toString() === id)[0];

        // Get the top 10 OTUs for the individual
        var otu_ids = individual.otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse();
        var sample_values = individual.sample_values.slice(0, 10).reverse();
        var otu_labels = individual.otu_labels.slice(0, 10).reverse();

        // Create the trace for the bar chart
        var barData = [{
            x: sample_values,
            y: otu_ids,
            text: otu_labels,
            type: "bar",
            orientation: "h"
        }];

        // Plot the bar chart
        Plotly.newPlot("bar", barData);

        // Create the trace for the bubble chart
        var bubbleData = [{
            x: individual.otu_ids,
            y: individual.sample_values,
            text: individual.otu_labels,
            mode: 'markers',
            marker: {
                size: individual.sample_values,
                color: individual.otu_ids
            }
        }];

        // Plot the bubble chart
        Plotly.newPlot("bubble", bubbleData);

        // Display the sample metadata
        var metadataDiv = d3.select("#sample-metadata");
        metadataDiv.html("");
        Object.entries(metadata).forEach(([key, value]) => {
            metadataDiv.append("h6").text(`${key}: ${value}`);
        });
    }

    // Function to handle the change event when a new sample is selected
    function optionChanged(newSample) {
        buildCharts(newSample);
    }

    // Populate the dropdown menu with the sample ids
    var dropdownMenu = d3.select("#selDataset");
    data.names.forEach(name => {
        dropdownMenu.append("option").text(name).property("value", name);
    });

    // Call the function to build the charts and display the metadata when the page loads
    buildCharts(data.names[0]);

}).catch(function(error) {
    console.log("Error:", error);
});
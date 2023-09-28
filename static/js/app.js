// Fetch the JSON data and store it
let data;

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

d3.json(url).then((incomingData) => {
    data = incomingData;
    init();
});

function init() {
    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Use D3 to get sample names and populate the drop-down selector
    let names = data.names;

    // Add samples to dropdown menu
    names.forEach((id) => {
        dropdownMenu.append("option")
        .text(id)
        .property("value",id);
    });

    // Set the first sample from the list
    let sample_one = names[0];

    // Build the initial plots
    buildCharts(sample_one);
};

function buildCharts(id) {
    // Filter the data for the selected sample
    let individual = data.samples.filter(sample => sample.id === id)[0];
    let metadata = data.metadata.filter(meta => meta.id.toString() === id)[0];

    // Get the top 10 OTUs for the individual
    let otu_ids = individual.otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse();
    let sample_values = individual.sample_values.slice(0, 10).reverse();
    let otu_labels = individual.otu_labels.slice(0, 10).reverse();

    // Create the trace for the bar chart
    let barData = [{
        x: sample_values,
        y: otu_ids,
        text: otu_labels,
        type: "bar",
        orientation: "h"       
    }];
// Create the layout for the bar chart
let barLayout = {
    title: 'Top 10 OTUs',
    xaxis: { title: 'Sample Values' },
    yaxis: { title: 'OTU IDs' }
};
// Plot the bar chart
    Plotly.newPlot("bar", barData, barLayout);

    // Create the trace for the bubble chart
    let bubbleData = [{
        x: individual.otu_ids,
        y: individual.sample_values,
        text: individual.otu_labels,
        mode: 'markers',
        marker: {
            size: individual.sample_values,
            color: individual.otu_ids
        }
    }];
 // Create the layout for the bubble chart
 let bubbleLayout = {
    title: 'OTU IDs and Sample Values',
    xaxis: { title: 'OTU IDs' },
    yaxis: { title: 'Sample Values' }
};
    // Plot the bubble chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Display the sample metadata
    let metadataDiv = d3.select("#sample-metadata");
    metadataDiv.html("");
    Object.entries(metadata).forEach(([key, value]) => {
        metadataDiv.append("h6").text(`${key}: ${value}`);
    });
}

// Function that updates dashboard when sample is changed
function optionChanged(newSample) { 
    // Call all functions 
    buildCharts(newSample);
};

// Call the initialize function
init();
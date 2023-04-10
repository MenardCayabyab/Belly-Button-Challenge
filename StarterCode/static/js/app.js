// Getting url
// We can use let, but in this case we are using const because the value of the URL will change once it has been intialized.
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Running url using d3.
// The d3 code loads the data from a JSON file and then logs the data to the console to helpo debugging and understanding the behavior
// of the code when intialized.
d3.json(url).then(function(data) {
    console.log(data);
});

// Initializing dashboard
function init() {
    // The # symbols is used to indicate that the selector is an ID and the selDataset is specific ID that is
    // being selected
    let dropdownMenu = d3.select("#selDataset");
    // Loading data using d3 from the JSON file located at the specified URL
    d3.json(url).then((data) => {
        // Extracting the array of names from the dataset (code above, d3 is parsing the url data to data)
        let names = data.names;
        // We then want to loop through each name and add them in a drop down menu with the text being the id
        // Since there are no patient names within the dataset we will then use the id as each person's unique
        // identifier. Lastly, the property is set to the value of each ID (patient). Basically, the method is
        // associating a specific value with each option in a drop down menu.
        names.forEach((id) => {
            console.log(id);
            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });

        let sample_one = names[0];
        console.log(sample_one);

        buildMetadata(sample_one);
        buildBarChart(sample_one);
        buildBubbleChart(sample_one);
        buildGaugeChart(sample_one);

    });
};

function buildMetadata(sample) {
    d3.json(url).then((data) => {
        let metadata = data.metadata;
        let value = metadata.filter(result => result.id == sample);
        console.log(value)
        let valueData = value[0];
        d3.select("#sample-metadata").html("");
        Object.entries(valueData).forEach(([key,value]) => {
            console.log(key,value);
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
};

function buildBarChart(sample) {
    d3.json(url).then((data) => {
        let sampleInfo = data.samples;
        let value = sampleInfo.filter(result => result.id == sample);
        let valueData = value[0];
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;
        console.log(otu_ids,otu_labels,sample_values);

        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();

        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        let layout = {
            title: "Subject's Top 10 OTUs Present"
        };

        Plotly.newPlot("bar",[trace],layout)
    });
};

function buildBubbleChart(sample) {
    d3.json(url).then((data) => {
        let sampleInfo = data.samples;
        let value = sampleInfo.filter(result => result.id == sample);
        let valueData = value[0];
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        console.log(otu_ids,otu_labels,sample_values);
    
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };
    
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };
        // Did not capitilize P in newplot which caused my chart to not appear. - FIXED
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

function optionChanged(value) {
    console.log(value);
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
    buildGaugeChart(value);
};

init();



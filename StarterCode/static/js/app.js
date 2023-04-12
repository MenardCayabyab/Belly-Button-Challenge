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
        // In the dataset, names is a list of numbers therefore we want to match the id number from
        // the id key to the numbers in the names array. From there, if there is a match we want to add it in 
        // the drop down menu. The items in the drop down menu are considered options but instead of saying option
        // 1,2,3,4 etc. We want to set the options text as the patient id. Laslty, we set the values that is stored
        // within the dataset per option appended.
        names.forEach((id) => {
            console.log(id);
            dropdownMenu.append("option")
            // Here we are setting the text of the option element to the current id/subject
            .text(id)
            // Similar to setting the text, this tim ewe are setting the value of the option per id/subject
            .property("value",id);
        });

        // In the chunk of code below, we are initializing the variable sample_one having the first element
        // of the names array.
        let sample_one = names[0];
        // logging to the console for debugging purposes later on.
        console.log(sample_one);
        // We then build our first chart for the first subject. This is so when the end user opens the HTML
        // there will immediately be a subject already chosen with the interactive charts visible.
        // We are building metadata to provide additional information and context about the patient and their
        // results.
        buildMetadata(sample_one);
        buildBarChart(sample_one);
        buildBubbleChart(sample_one);
        buildGaugeChart(sample_one);

    });
};

// Notice that we are using sample rather than sample_one, even though we didn't define it is a parameter which represents
// the ID of the subject. It is a more generalized parameter
function buildMetadata(sample) {
    // Using d3 to retrieve our data.
    d3.json(url).then((data) => {
        // Here we are initializing a new varible (metadata) and assigning it the value of the metadata property
        // in th data object.
        let metadata = data.metadata;
        // Now we assign the a value a filtering method. In this case, it will find elements in the metadata array
        // whose id matches the sample.
        let value = metadata.filter(result => result.id == sample);
        console.log(value)
        let valueData = value[0];
        // Clear out contents. This is so that everytime we select or call on the buildmetadata(sample) we get a refresh
        // of data per patient. This means everytime we select a new patient we would get their information rather than showing
        // the previous patient's information.
        d3.select("#sample-metadata").html("");
        Object.entries(valueData).forEach(([key,value]) => {
            console.log(key,value);
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
};
// Building our bar chart
function buildBarChart(sample) {
    // Retrieving our data
    d3.json(url).then((data) => {
        // Getting our sample data
        let sampleInfo = data.samples;
        // Now we filter our data based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);
        // We then want to extract the first item from the array that matches our filter.
        let valueData = value[0];

        // Setting up our labels we will be using for our bar chart.
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        console.log(otu_ids,otu_labels,sample_values);

        // Here we want the top 10 items to be displayed (0,10) in descending order (hence the reverse)
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();

        // Now we add all our information we defined in our bar chart.
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            // "h" = horizontal
            orientation: "h"
        };
        
        // Lasltly, we set up our layout and plot using plotly
        let layout = {
            title: "Subject's Top 10 OTUs Present"
        };

        Plotly.newPlot("bar",[trace],layout)
    });
};

// The same concept from making our bar chart applies to this chart with slight differences.
function buildBubbleChart(sample) {
    d3.json(url).then((data) => {
        let sampleInfo = data.samples;
        let value = sampleInfo.filter(result => result.id == sample);
        let valueData = value[0];

        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        console.log(otu_ids,otu_labels,sample_values);
        
        // Notice we expanded our options for markers. We want the size of each marker to be related
        // to each patient's sample values. and color depedning on which otu each patient has 
        // (each unique to different OTUs)
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

// We then want to call on a function that updates our dashboard when samle is changed. Or when
// choosing another patient/subject.
function optionChanged(value) {

    console.log(value);
    
    // Calling all our functions.
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
    buildGaugeChart(value);
};

init();
// Getting our data from the URL (posted in the other code) and using d3 to extract information.
d3.json(url).then(function(data) {
    console.log(data);
});

// Calling init to initialize our dashboard when the user goes to our HTML.
function init() {
    // Using d3 to select the dropdown menu and using d3 again to get sample names and populate the drop
    // down selector with the extracted data.
    let dropdownMenu = d3.select("#selDataset")
    d3.json(url).then((data) => {
        // Setting our variables for the sample names
        let names = data.names;
        // Then adding samples to the dropdown menu
        names.forEach((id) => {
            console.log(id);
        });
        // Getting first item from the list
        let sample_one = names[0];
        console.log(sample_one);

        // Build our guage chart
        buildGaugeChart(sample_one);
    });
};

// Similar concept as building our previous charts from the main code.
function buildGaugeChart(sample) {
    d3.json(url).then((data) => {
        let metadata = data.metadata;
        let value = metadata.filter(result => result.id == sample);
        console.log(value)
        let valueData = value[0];
        let washFrequency = Object.values(valueData)[6];
        let trace2 = {
            value: washFrequency,
            domain: {x:[0,1], y:[0,1]},
            title: {
                text: "<b>Weekly Belly Button Washing</b><br>Frequency Per Subject",
                font: {color: "black", size: 16}
            },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: {range: [0,10], tickmode: "linear", tick0: 2, dtick: 2},
                bar: {color: "black"},
                steps: [
                    {range: [0, 1], color: "rgba(255, 255, 255, 0)"},
                    {range: [1, 2], color: "rgba(232, 226, 202, .5)"},
                    {range: [2, 3], color: "rgba(210, 206, 145, .5)"},
                    {range: [3, 4], color:  "rgba(202, 209, 95, .5)"},
                    {range: [4, 5], color:  "rgba(184, 205, 68, .5)"},
                    {range: [5, 6], color: "rgba(170, 202, 42, .5)"},
                    {range: [6, 7], color: "rgba(142, 178, 35 , .5)"},
                    {range: [7, 8], color:  "rgba(110, 154, 22, .5)"},
                    {range: [8, 9], color: "rgba(50, 143, 10, 0.5)"},
                    {range: [9, 10], color: "rgba(14, 127, 0, .5)"},
                ]
            }
        };
        // Setting our layout
        let layout = {
            width: 350,
            height: 350,
            margin: {t:0, b:0}
        };
        //plaot our guage chart using plotly
        Plotly.newPlot("gauge",[trace2],layout)
    });
};

init();
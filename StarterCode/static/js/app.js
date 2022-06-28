
// Initialize starting function to display on home page

function init(){
    // Select the frop down menu from the html file 
    var dropDownMenu = d3.select("#selDataset")
    d3.json("samples.json").then(data => {
        console.log(data)
        var IDName = data.names;
        IDName.forEach(name => dropDownMenu.append('option').text(name).property('value', name))    
    BuildPlots(IDName[0]);
    DemographicInfo(IDName[0]);
    });
};


// Create function to populate demographic panel
function DemographicInfo(UID){
    var panel = d3.select("#sample-metadata");
    panel.html("");
    d3.json("samples.json").then(data => { 
        var demInfo = data.metadata;
        demInfo = demInfo.filter(patientRow => patientRow.id == UID)[0];
        Object.entries(demInfo).forEach(([key,value]) => {
            panel.append("h5").text(`${key.toUpperCase()}: ${value}`);
        });
    })
}

init();

// Create a function to create bar and bubble graph when option is selected
function BuildPlots(id){
    d3.json("samples.json").then(data => {
        console.log(data);
        var sample = data.samples;
        var filteredSample = sample.filter(s => s.id ==id)[0]
        var x_value = filteredSample.sample_values.slice(0, 10).reverse();
        var y_value = filteredSample.otu_ids.slice(0,10).map(OTUID => 'OTU' + OTUID).reverse();
        var label = filteredSample.otu_labels.slice(0,10).reverse();

        var traceBar = {
            x: x_value,
            y: y_value,
            type: "bar",
            text: label,
            orientation: 'h'
        };

        var dataBar = [traceBar];
        var layoutBar = {
            title: "Top 10 OTU in Sample"
        };

        var traceBubble = {
            x: filteredSample.otu_ids,
            y: filteredSample.sample_values,
            mode: 'markers',
            marker: {
                size: filteredSample.sample_values,
                color: filteredSample.otu_ids
            },
            text: label
        };

        var dataBubble = [traceBubble];

        var layoutBubble = {
            title: "Bacteria in Sample and Correspoding Frequency",
            xaxis: {title: 'OTU ID'},
            yaxis: {title: 'Frequency'}
        };

        Plotly.newPlot("bar", dataBar, layoutBar);
        Plotly.newPlot("bubble", dataBubble, layoutBubble);

    })
}

function optionChanged(id){
    BuildPlots(id);
    DemographicInfo(id);
};





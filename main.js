// Load the data
const iris = d3.csv("iris.csv");

// Once the data is loaded, proceed with plotting
penguins.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
        d.PetalLength = +d.PetalLength;
        d.PetalWidth = +d.PetalWidth;
    });

    // Define the dimensions and margins for the SVG


    // Create the SVG container
    
    
    // Set up scales for x and y axes
    // d3.min(data, d => d.bill_length_mm)-5

    const colorScale = d3.scaleOrdinal()
        .domain(data.map(d => d.Species))
        .range(d3.schemeCategory10);

    // Add scales     
    

    // Add circles for each data point
    

    // Add x-axis label
    

    // Add y-axis label
    

    // Add legend
    const legend = svg.selectAll(".legend")
        .data(colorScale.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => "translate(0," + i * 20 + ")");

});

penguins.then(function(data) {
    // Convert string values to numbers
    

    // Define the dimensions and margins for the SVG
    

    // Create the SVG container
    

    // Set up scales for x and y axes
    

    // Add scales     
    

    // Add x-axis label
    

    // Add y-axis label
    

    const rollupFunction = function(groupData) {
        const values = groupData.map(d => d.PetalLength).sort(d3.ascending);
        const q1 = d3.quantile(values, 0.25);
        return { q1};
    };

    const quartilesBySpecies = d3.rollup(data, rollupFunction, d => d.Species);

    quartilesBySpecies.forEach((quartiles, Species) => {
        const x = xScale(Species);
        const boxWidth = xScale.bandwidth();

        // Draw vertical lines
        
        // Draw box
        
        // Draw median line
        
        
    });
});
// Load the data
const iris = d3.csv("iris.csv");

// Once the data is loaded, proceed with plotting
iris.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
        d.PetalLength = +d.PetalLength;
        d.PetalWidth = +d.PetalWidth;
    });

    // Define the dimensions and margins for the SVG
    const margin = { top: 50, right: 100, bottom: 50, left: 50 }, // Increased right margin
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    // Create the SVG container
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Set up scales for x and y axes
    const xScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.PetalLength) - 1, d3.max(data, d => d.PetalLength) + 1])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.PetalWidth) - 0.5, d3.max(data, d => d.PetalWidth) + 0.5])
        .range([height, 0]);

    const colorScale = d3.scaleOrdinal()
        .domain(data.map(d => d.Species))
        .range(d3.schemeCategory10);

    // Add circles
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.PetalLength))
        .attr("cy", d => yScale(d.PetalWidth))
        .attr("r", 5)
        .attr("fill", d => colorScale(d.Species));

    // Add x-axis label
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", margin.bottom - 10)
        .style("text-anchor", "middle")
        .text("Petal Length");

    // Add y-axis label
    svg.append("g")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 10)
        .style("text-anchor", "middle")
        .text("Petal Width");

    // Add legend
    const legend = svg.selectAll(".legend")
        .data(colorScale.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => "translate(0," + (i * 20 + 10) + ")"); // Adjust y position for better spacing

    legend.append("rect")
        .attr("x", width + 10) // Position for the legend box
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", colorScale);

    legend.append("text")
        .attr("x", width + 30) // Increased x position for better visibility
        .attr("y", 15) // Center vertically
        .style("text-anchor", "start")
        .text(d => d);
});

// Box plot logic
iris.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
        d.PetalLength = +d.PetalLength;
    });

    // Define the dimensions and margins for the SVG
    const margin = { top: 50, right: 50, bottom: 50, left: 50 },
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    // Create the SVG container
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Set up scales for x and y axes
    const speciesScale = d3.scaleBand()
        .domain([...new Set(data.map(d => d.Species))])
        .range([0, width])
        .padding(0.2);

    const yScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.PetalLength) - 1, d3.max(data, d => d.PetalLength) + 1])
        .range([height, 0]);

    // Add scales     
    svg.append("g")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 10)
        .style("text-anchor", "middle")
        .text("Petal Length");

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(speciesScale))
        .append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", margin.bottom - 10)
        .style("text-anchor", "middle")
        .text("Species");

    // Rollup data
    const rollupFunction = function(groupData) {
        const values = groupData.map(d => d.PetalLength).sort(d3.ascending);
        const q1 = d3.quantile(values, 0.25);
        const median = d3.quantile(values, 0.5);
        const q3 = d3.quantile(values, 0.75);
        const min = values[0];
        const max = values[values.length - 1];
        return { q1, median, q3, min, max };
    };

    const quartilesBySpecies = d3.rollup(data, rollupFunction, d => d.Species);

    // Draw box plot elements
    quartilesBySpecies.forEach((quartiles, Species) => {
        const x = speciesScale(Species);
        const boxWidth = speciesScale.bandwidth();

        // Draw vertical lines (min to max)
        svg.append("line")
            .attr("x1", x + boxWidth / 2)
            .attr("x2", x + boxWidth / 2)
            .attr("y1", yScale(quartiles.min))
            .attr("y2", yScale(quartiles.max))
            .attr("stroke", "black");

        // Draw box (Q1 to Q3)
        svg.append("rect")
            .attr("x", x)
            .attr("y", yScale(quartiles.q3))
            .attr("width", boxWidth)
            .attr("height", yScale(quartiles.q1) - yScale(quartiles.q3))
            .attr("class", "box");

        // Draw median line
        svg.append("line")
            .attr("x1", x)
            .attr("x2", x + boxWidth)
            .attr("y1", yScale(quartiles.median))
            .attr("y2", yScale(quartiles.median))
            .attr("stroke", "red")
            .attr("stroke-width", 2);
    });
});



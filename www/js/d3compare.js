app.d3chart = {};

app.d3chart.create = function(el, data) {
    // Set the dimensions of the canvas / graph
    var margin = {top: 30, right: 10, bottom: 70, left: 40},
        width =  1920 - margin.left - margin.right,
        height = 1080 - margin.top - margin.bottom;
    //this.update(el, data);
    var svg = d3.select(el)
                .append("svg")
                .attr('class', 'd3-svg')
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

    var g = svg.append("g").attr('class', 'd3-chart')
                .append("g")
                .attr("transform", 
                      "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scale.ordinal().rangePoints([margin.left, width]);
    var y = d3.scale.linear().range([height, 0]);
    // Define the line
    var sizeline = d3.svg.line()	
                      .x(function(d) { return x(d.filename); })
                      .y(function(d) { return y(d.text); });

    if (data.length != 0) {
        // Scale the range of the data
        x.domain(data[0].objsizes.map(function (e) { return e.filename}));
        y.domain([0, 10*1024]);
        var color = d3.scale.category10();   // set the colour scale
        legendSpace = width/data.length; // spacing for the legend
        // Loop through each symbol / key
        for (var i = 0; i<data.length; ++i) {
            var d = data[i];
            svg.append("path")
               .attr("class", "line")
               .style("stroke", function() { // Add the colours dynamically
                   return d.color = color(d.metadata.toolchain); })
               .attr("id", 'tag'+d.metadata.toolchain.replace(/\s+/g, '')) // assign ID
               .attr("d", sizeline(d.objsizes));
            // Add the Legend
            svg.append("text")
               .attr("x", margin.left + i*legendSpace)  // space legend
               .attr("y", margin.top)
               .attr("class", "legend")    // style the legend
               .style("fill", function() { // Add the colours dynamically
                   return d.color = color(d.metadata.toolchain); })
               .on("click", function(){
                   alert('Clicked');
                   // Determine if current line is visible 
                   var active   = d.active ? false : true,
                       newOpacity = active ? 0 : 1; 
                   // Hide or show the elements based on the ID
                   d3.select("#tag"+d.metadata.toolchain.replace(/\s+/g, ''))
                     .transition().duration(100) 
                     .style("opacity", newOpacity); 
                   // Update whether or not the elements are active
                   d.active = active;
               })  
               .text(d.metadata.toolchain); 
        }
    }
    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
                  .orient("bottom");
    var yAxis = d3.svg.axis().scale(y)
                  .orient("left");
    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)" );
    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + width + ",0)")
        .call(yAxis);
}

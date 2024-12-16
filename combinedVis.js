

document.addEventListener("DOMContentLoaded", function () {
    d3.csv("Drug use disorder death rate - Sheet3.csv").then((data) => {
      data.forEach((d) => {
        d.year = +d.year;
        d.val = +d.val;
      });
  
      const margin = { top: 50, right: 100, bottom: 50, left: 70 };
      const width = 1000 - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;
  
      const svg = d3
        .select("#line-chartCom")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
  
      const x = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d.year))
        .range([0, width]);
  
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.val)])
        .range([height, 0]);
  
      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(10).tickFormat(d3.format("d")));
  
      svg.append("g").call(d3.axisLeft(y));
  
      const color = d3
        .scaleOrdinal()
        .domain([...new Set(data.map((d) => d.location))])
        .range(d3.schemeCategory10);
  
      const line = d3
        .line()
        .x((d) => x(d.year))
        .y((d) => y(d.val));
  
      const nestedData = d3.group(data, (d) => d.location);
  
      const paths = svg
      .selectAll(".line")
      .data(nestedData)
      .enter()
      .append("path")
      .attr("class", "line")
      .attr("d", ([location, values]) => line(values))
      .style("fill", "none")
      .style("stroke", ([location]) => color(location))
      .style("stroke-width", 2)
      .on("mouseover", function (event, [location]) {
        d3.select(this).style("stroke-width", 4);
    
        paths.style("opacity", ([loc]) => (loc === location ? 1 : 0.2));
    
        paths
        .each(function ([location, values]) {
          const lastValue = values[values.length - 1];
          svg
            .append("text")
            .attr("x", x(lastValue.year) - 40) 
            .attr("y", y(lastValue.val)-20)
            .attr("dy", "0.35em")
            .style("font-size", "12px")
            .style("fill", color(location))
            .text(location);
          });

        svg
          .selectAll(".point")
          .style("fill", (d) => (d.location === location ? color(d.location) : "grey"));
    

        tooltip
          .style("visibility", "visible")
          .text(`Location: ${location}`);
      })
      .on("mousemove", function (event) {

        tooltip
          .style("top", `${event.pageY - 20}px`)
          .style("left", `${event.pageX + 20}px`);
      })

      .on("mouseout", function () {
        // Reset the line styles
        paths.style("opacity", 1);
        d3.select(this).style("stroke-width", 2);
    
        svg
          .selectAll(".point")
          .style("fill", (d) => color(d.location)); 
    
        tooltip.style("visibility", "hidden");
      });
    
    svg
      .selectAll(".point")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("cx", (d) => x(d.year))
      .attr("cy", (d) => y(d.val))
      .attr("r", 4)
      .style("fill", (d) => color(d.location)) 
      .on("mouseover", function (event, d) {
        d3.select(this)
          .attr("r", 8) // Make the dot bigger
          .style("fill", color(d.location)); 
    
        svg
          .selectAll(".point")
          .filter((point) => point !== d) 
          .style("fill", "grey"); // Set the color to grey
    
        tooltip
          .style("visibility", "visible")
          .text(`Year: ${d.year}, Death Rate: ${d.val.toFixed(2)}`);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("top", `${event.pageY - 20}px`)
          .style("left", `${event.pageX + 20}px`);
      })
      .on("mouseout", function () {

        d3.select(this)
          .attr("r", 4) // Reset dot size
          .style("fill", (d) => color(d.location)); 
    
        svg
          .selectAll(".point")
          .style("fill", (d) => color(d.location));
            tooltip.style("visibility", "hidden");
      });
  
      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "#f9f9f9")
        .style("border", "1px solid #ccc")
        .style("padding", "5px")
        .style("border-radius", "4px")
        .style("visibility", "hidden");

    });




    // scroll effect
    const sections = document.querySelectorAll(".fade-in-section");

    const observer = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target); 
                }
            });
        },
        { threshold: 0.2 } //20% of text is showing
    );

    sections.forEach(section => observer.observe(section));
  });
  
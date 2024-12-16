document.addEventListener("DOMContentLoaded", function () {
  // Data and chart setup USA
  const data = [
    { year: 1980, value: 1.363601397 },
    { year: 1981, value: 1.412571636 },
    { year: 1982, value: 1.469963729 },
    { year: 1983, value: 1.538735138 },
    { year: 1984, value: 1.679622039 },
    { year: 1985, value: 1.872581578 },
    { year: 1986, value: 2.072599879 },
    { year: 1987, value: 2.140442044 },
    { year: 1988, value: 2.231083 },
    { year: 1989, value: 2.252109074 },
    { year: 1990, value: 2.248713195 },
    { year: 1991, value: 2.357017358 },
    { year: 1992, value: 2.543824454 },
    { year: 1993, value: 2.824044653 },
    { year: 1994, value: 3.063343317 },
    { year: 1995, value: 3.306291334 },
    { year: 1996, value: 3.482181488 },
    { year: 1997, value: 3.686745433 },
    { year: 1998, value: 3.963672053 },
    { year: 1999, value: 4.439278425 },
    { year: 2000, value: 4.959209864 },
    { year: 2001, value: 5.591276672 },
    { year: 2002, value: 6.362640029 },
    { year: 2003, value: 7.09645781 },
    { year: 2004, value: 7.661016334 },
    { year: 2005, value: 8.402111369 },
    { year: 2006, value: 9.072591305 },
    { year: 2007, value: 9.44973749 },
    { year: 2008, value: 9.779857159 },
    { year: 2009, value: 10.11930381 },
    { year: 2010, value: 10.45958146 },
    { year: 2011, value: 11.06346916 },
    { year: 2012, value: 11.56170658 },
    { year: 2013, value: 12.29540567 },
    { year: 2014, value: 13.33253138 },
    { year: 2015, value: 14.80245293 },
    { year: 2016, value: 16.7335083 },
    { year: 2017, value: 18.28037847 },
    { year: 2018, value: 18.94110322 },
    { year: 2019, value: 19.81966205 },
    { year: 2020, value: 20.47221498 },
    { year: 2021, value: 21.31204442 }

  ];

  const startYear = 1994;

  const margin = { top: 50, right: 50, bottom: 50, left: 70 };
  const width = 1000 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const svg = d3
    .select("#line-chart2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Scales
  const x = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.year))
    .range([0, width]);

  const y = d3
    .scaleLinear()
    .domain([0, 22])
    .range([height, 0]);

  // Gridlines
  function make_x_gridlines() {
    return d3.axisBottom(x).ticks(d3.range(1980, 2021, 5)); 
  }

  function make_y_gridlines() {
    return d3.axisLeft(y).ticks(5);
  }

  // Add the X gridlines
  svg
    .append("g")
    .attr("class", "grid")
    .attr("transform", `translate(0,${height})`)
    .call(make_x_gridlines().tickSize(-height).tickFormat(""));

  // Add the Y gridlines
  svg
    .append("g")
    .attr("class", "grid")
    .call(make_y_gridlines().tickSize(-width).tickFormat(""));

  // Axes
  svg
  .append("g")
  .attr("class", "axis-x-line")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(x).tickFormat(d3.format("d"))) // Format years on x-axis
  .selectAll("text")
  .style("text-anchor", "middle");

  svg.append("g").attr("class", "axis-y-line").call(d3.axisLeft(y));

  svg
  .append("text")
  .attr("class", "x-axis-label")
  .attr("text-anchor", "middle")
  .attr("x", width / 2)
  .attr("y", height + margin.bottom - 10)
  .text("Year");

  // Y-Axis Label
  svg
    .append("text")
    .attr("class", "y-axis-label")
    .attr("text-anchor", "top")
    .attr("x", 0)
    .attr("y", -20)
    .text("Overdose Counts, per 100,000");
    
    
    svg
    .append("rect")
    .attr("x", x(1980))
    .attr("y", 0)
    .attr("width", x(1993) - x(1980))
    .attr("height", height)
    .attr("fill", "grey") // light grey
    .attr("opacity", 0.1);
    
  // Line generator
  const line = d3
    .line()
    .x((d) => x(d.year))
    .y((d) => y(d.value))
    .defined((d) => d.value !== null)
    .curve(d3.curveCardinal);


    svg
      .append("path")
      .datum(data.filter(d => d.year <= 1993))//showing the 1994 data before user interaction
      .attr("class", "line")
      .attr("d", line);

      
  // User drawn line data
  let userData = data.map((d) => {
    if (d.year >= startYear) {
      return { year: d.year, value: null };
    } else {
      return { ...d };
    }
  });

  const userLine = d3
    .line()
    .x((d) => x(d.year))
    .y((d) => y(d.value))
    .defined((d) => d.value !== null)
    .curve(d3.curveCardinal);

  const userPath = svg
    .append("path")
    .datum(userData)
    .attr("class", "user-line");

  // Interaction

  const instructionText = svg
  // this adds the instruction text that disappears after the user starts drawing 
    .append("text")
    .attr("x", width / 2)
    .attr("y", height / 2 - 20)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "gray")
    .attr("class", "instruction-text")
    .attr("opacity", 1)
    .transition()
    .duration(1000)
    .text("Draw your prediction for overdose counts starting from 1994.");

  const overlay = svg
    .append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all");

  let isDrawingComplete = false;

  overlay.call(
    d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
  );

  function clamp(a, b, c) {
    return Math.max(a, Math.min(b, c));
  }

  let drawing = false;

  function dragstarted(event) {
    drawing = true;
      svg.select(".instruction-text")
      // svg.select(".instruction-text").remove();
      // instead of removing, I'm making it fade out
      .transition()
      .duration(1000)
      .attr("opacity", 0)
    userPath.datum(userData).attr("d", userLine);
  }

  function dragged(event) {
    if (!drawing) return;
    console.log(event);
    // Corrected mouse position
    const [mx, my] = d3.pointer(event, svg.node());
    console.log([mx, my]);
    const mouseYear = x.invert(mx);
    const mouseValue = y.invert(my);

    // Find the closest data point
    let closestPoint = null;
    let minDiff = Infinity;

    userData.forEach((d) => {
      if (d.year >= startYear) {
        const diff = Math.abs(d.year - mouseYear);
        if (diff < minDiff) {
          minDiff = diff;
          closestPoint = d;
        }
      }
    });

    if (closestPoint && minDiff < x.invert(10) - x.invert(0)) {
      closestPoint.value = clamp(0, y.domain()[1], mouseValue);

      userPath.datum(userData).attr("d", userLine);

      // Check if user has completed drawing
      const allDefined = userData
        .filter((d) => d.year >= startYear)
        .every((d) => d.value !== null);
      if (allDefined) {
        document.getElementById("show-results2").disabled = false;
        isDrawingComplete = true;
      }
    }
  }

  function dragended(event) {
    drawing = false;
  }

  // Show Results
  document
  .getElementById("show-results2")
  .addEventListener("click", function () {
    if (isDrawingComplete) {
      // Draw the actual data line
      svg.append("path").datum(data).attr("class", "line").attr("d", line);

      svg// add the line
        .append("line")
        .attr("x1", x(1992))
        .attr("x2", x(1992))
        .attr("y1", 200)
        .attr("y2", height)
        .transition()
        .duration(1000)  // transition
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("stroke-opacity", 1)  // opacity of the line
        .attr("stroke-dasharray", "5,5");
        
      svg // add the text
        .append("text")
        .attr("x", x(1992.5)) 
        .attr("y", 214) 
        .attr("text-anchor", "start")
        .attr("font-size", "14px")
        .attr("fill", "black")  
        .text("1992 - Clinton's 'War On Drugs' policy")
        .attr("opacity", 0)
        .transition() 
        .duration(1000)  // Transition time
        .delay(1000) 
        .attr("opacity", 1); 

        svg// add the line
          .append("line")
          .attr("x1", x(2010))
          .attr("x2", x(2010))
          .attr("y1", 60)
          .attr("y2", height)
          .transition()
          .duration(1000)  // transition
          .attr("stroke", "red")
          .attr("stroke-width", 2)
          .delay(3000) 

          .attr("stroke-opacity", 1)  // opacity of the line
          .attr("stroke-dasharray", "5,5");
          
        svg // add the text
          .append("text")
          .attr("x", x(2009.5)) 
          .attr("y", 74) 
          .attr("text-anchor", "end")
          .attr("font-size", "14px")
          .attr("fill", "black")  
          .text("2010 - Obama’s Harm Reduction Efforts")
          .attr("opacity", 0)
          .transition() 
          .duration(1000)  // Transition time
          .delay(4000) 
          .attr("opacity", 1); 


      // Change the opacity of the user-drawn line to 30%
      userPath.transition()
        .duration(1000) 
        .style("opacity", 0.3);  // Set the opacity to 30%

      // Change the instruction text
      document.querySelector(".instruction").textContent =
        "Actual data revealed!";

      // Disable and hide the "Show Results" button
      const showResultsButton = document.getElementById("show-results2");
      showResultsButton.disabled = true;  // Disable the button
      showResultsButton.style.display = "hidden";  // Hide the button

      isDrawingEnabled = false;
       // stop letting the user being able to draw and change their previously drawn graph

      d3.selectAll(".drawing-path")
        .style("pointer-events", "none");

      // Remove drawing behavior by removing event listeners
      overlay.on("mousedown", null)
            .on("mousemove", null)  
            .on("mouseup", null);  

      svg.selectAll("*").style("pointer-events", "none");
    }
  });
});

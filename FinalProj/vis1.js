document.addEventListener("DOMContentLoaded", function () {
    // Data and chart setup
    const data = [
  { year: 1980, value: 1.005668704 },
  { year: 1981, value: 0.9915681106 },
  { year: 1982, value: 0.9999770289 },
  { year: 1983, value: 1.008872001 },
  { year: 1984, value: 1.013472008 },
  { year: 1985, value: 1.021525075 },
  { year: 1986, value: 1.052136599 },
  { year: 1987, value: 1.112564817 },
  { year: 1988, value: 1.208126855 },
  { year: 1989, value: 1.348067071 },
  { year: 1990, value: 1.502930956 },
  { year: 1991, value: 1.694306227 },
  { year: 1992, value: 1.883768038 },
  { year: 1993, value: 2.082769904 },
  { year: 1994, value: 2.169903214 },
  { year: 1995, value: 2.209873108 },
  { year: 1996, value: 2.269416258 },
  { year: 1997, value: 2.376771597 },
  { year: 1998, value: 2.586418925 },
  { year: 1999, value: 2.762112453 },
  { year: 2000, value: 2.923301778 },
  { year: 2001, value: 3.070474083 },
  { year: 2002, value: 3.225818112 },
  { year: 2003, value: 3.396098543 },
  { year: 2004, value: 3.569756983 },
  { year: 2005, value: 3.8391945 },
  { year: 2006, value: 4.007657124 },
  { year: 2007, value: 4.204804553 },
  { year: 2008, value: 4.362702293 },
  { year: 2009, value: 4.517295795 },
  { year: 2010, value: 4.694685436 },
  { year: 2011, value: 4.891250984 },
  { year: 2012, value: 5.08113059 },
  { year: 2013, value: 5.278405946 },
  { year: 2014, value: 5.456092342 },
  { year: 2015, value: 5.638424239 },
  { year: 2016, value: 5.82445347 },
  { year: 2017, value: 6.004342295 },
  { year: 2018, value: 6.180118255 },
  { year: 2019, value: 6.353616239 },
  { year: 2020, value: 6.526524058 },
  { year: 2021, value: 6.700960736 }
    ];
  
    const startYear = 1980;
  
    const margin = { top: 50, right: 50, bottom: 50, left: 70 };
    const width = 1000 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
  
    const svg = d3
      .select("#line-chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      // .style("background", "#f5f5f5")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    // Scales
    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.year))
      .range([0, width]);
  
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value+2)])
      .range([height, 0]);
  
    // Gridlines
    function make_x_gridlines() {
      return d3.axisBottom(x).ticks(data.length);
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
      .call(d3.axisBottom(x).ticks(data.length).tickFormat(d3.format("d")));
  
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
      
    // Line generator
    const line = d3
      .line()
      .x((d) => x(d.year))
      .y((d) => y(d.value))
      .defined((d) => d.value !== null)
      .curve(d3.curveCardinal);
  
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
      userData.forEach((d) => {
        if (d.year >= startYear) {
          d.value = null;
        }
      });
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
          document.getElementById("show-results").disabled = false;
          isDrawingComplete = true;
        }
      }
    }
  
    function dragended(event) {
      drawing = false;
    }
  
    // Show Results
    document
      .getElementById("show-results")
      .addEventListener("click", function () {
        if (isDrawingComplete) {
          // Draw the actual data line
          svg.append("path").datum(data).attr("class", "line").attr("d", line);
  
          // Optionally, display a message or update the instruction
          document.querySelector(".instruction").textContent =
            "Actual data revealed!";
        }
      });
  });
  
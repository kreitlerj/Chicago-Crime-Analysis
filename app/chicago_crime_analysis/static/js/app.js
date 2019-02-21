// Declare global variables to hold data values
var monthly_2017;
var monthly_2018;
var ward_2017;
var ward_2018;

// Define function to build Linechart
function buildLine(year1, year2){
  monthly_2017 = year1;
  monthly_2018 = year2;
  console.log(monthly_2017);
  console.log(monthly_2018);

  // Trace for 2017
  var trace1 = {
    x: Object.keys(monthly_2017),
    y: Object.values(monthly_2017),
    type: "line",
    name: "2017"
  };

  // Trace for 2018
  var trace2 = {
    x: Object.keys(monthly_2018),
    y: Object.values(monthly_2018),
    type: "line",
    name: "2018"
  };

  var data = [trace1, trace2];

  // Layout
  var layout = {
    title: "Number of Crimes Through the Year",
    xaxis: { title: "Month"},
    yaxis: { title: "# of Crimes"}
  };

  // Add the plot to the html
  Plotly.newPlot("plot", data, layout);
};

// Define function to build map
function buildMap(year1, year2) {
  // Assign ward data to the global variables
  ward_2017 = year1;
  ward_2018 = year2;

  // Log ward data to the console
  console.log(ward_2017);
  console.log(ward_2018);

  // Define function to determine ward color in the map
  function comparisonColor(ward_1, ward_2) {
    if ((ward_2 - ward_1) < 0) {
      return "green";
    }
    else if ((ward_2 - ward_1) === 0) {
      return "yellow";
    }
    else {
      return "red";
    };
  };


  // Define the two basemap layers
  var outdoorsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });

  var grayscalemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // Create the overlay layer
  var comparison_map = new L.LayerGroup();

  var baseMaps = {
    "Outdoor Map": outdoorsmap,
    "Greyscale Map": grayscalemap
  };

  var overlayMaps = {
    "Change in Crime": comparison_map
  };

  // Remove the old map when updating for a change in selection
  var container = L.DomUtil.get('map');
      if(container != null){
        container._leaflet_id = null;
      };

  // Add map to the html
  var myMap = L.map("map", {
    center: [
      41.845, -87.63
    ],
    zoom: 11,
    layers: [outdoorsmap, comparison_map]
  });

  //Add layer control
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // URL for geoJSON data
  var geo_url = "../static/GeoJSON/chi_ward.geojson";

  // Create the wards and assign colors based on the change in crime numbers to the overlay map layer
  d3.json(geo_url, function(data) {
    L.geoJSON(data, {
      style: function(feature) {
        return {
          color: "white",
          fillColor: comparisonColor(ward_2017[feature.properties.ward], ward_2018[feature.properties.ward]),
          fillOpacity: 0.5,
          weight: 1.5
        };
      },
      onEachFeature: function(feature, layer) {
        layer.bindPopup("<h4>Ward: " + feature.properties.ward +
          "</h4><br><p>2017: " + ward_2017[feature.properties.ward] +
          "<p>2018: " + ward_2018[feature.properties.ward] +
          "<p>Change in Crime: " + (ward_2018[feature.properties.ward] - ward_2017[feature.properties.ward]) + 
          "</p>")
      }
    }).addTo(comparison_map)
  });

  // color function to be used when creating the legend
  function getColor(status) {
    if (status === "Crime Down") {
      return "green";
    }
    else if (status === "No Change") {
      return "yellow";
    }
    else if (status === "Crime Up") {
      return "red";
    }
  };

  // Add legend to the map
  var legend = L.control({position: 'bottomright'});
  
  legend.onAdd = function (map) {
      var legendDiv =  L.DomUtil.create('div', 'info legend'),
          status = ["Crime Down", "No Change", "Crime Up"],
          labels = [];
      for (var i = 0; i < status.length; i++) {
            labels.push( 
                '<i class="square" style="background:' + getColor(status[i]) + '"></i>'+ status[i] + '')
      }
        legendDiv.innerHTML = labels.join('<br>');
      return legendDiv
  };
  
  legend.addTo(myMap);
};

// Define function to update the charts
function updateCharts(crime) {
  // Determine url call based on selection on the webpage
  if (crime === "ALL") {
    var url = "/all_crime_data";
  }
  else {
    var url = "/crime_data/" + crime
  }

  // Use d3 to receive the json data from flask and run it through the charting functions
  d3.json(url, function(response) {
    buildLine(response["2017"]["monthly_crime"], response["2018"]["monthly_crime"]);
    buildMap(response["2017"]["ward_crime"], response["2018"]["ward_crime"]);
  });
};

// Define function to initialize the page
function init() {
  updateCharts("ALL");
};

init();
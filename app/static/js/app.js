var monthly_2017;
var monthly_2018;
var ward_2017;
var ward_2018;

// function buildLine(year1, year2){

// };

function buildMap(year1, year2) {
  ward_2017 = year1;
  ward_2018 = year2;
  console.log(ward_2017);
  console.log(ward_2018);

  function chooseColor(d) {
    return d > 4000 ? '#800026' :
           d > 3500  ? '#BD0026' :
           d > 3000  ? '#E31A1C' :
           d > 2500  ? '#FC4E2A' :
           d > 2000   ? '#FD8D3C' :
           d > 1000   ? '#FEB24C' :
           d > 500   ? '#FED976' :
                      '#FFEDA0';
  };

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

  // Create the 3 overlay layers
  var map_2017 = new L.LayerGroup();
  var map_2018 = new L.LayerGroup();
  var comparison_map = new L.LayerGroup();

  var baseMaps = {
    "Outdoor Map": outdoorsmap,
    "Greyscale Map": grayscalemap
  };

  var overlayMaps = {
    "Ward Crime 2017": map_2017,
    "Ward Crime 2018": map_2018,
    "Change in Crime": comparison_map
  };

  var myMap = L.map("map", {
    center: [
      41.88, -87.63
    ],
    zoom: 11,
    layers: [outdoorsmap, map_2017]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // URL for geoJSON data
  var geo_url = "../static/GeoJSON/chi_ward.geojson";

  // d3.json(geo_url, function(data){
  //   console.log(data.features);
  //   for (feature in data.features) {
  //     console.log(feature.properties);
  //   }
  // });
  // Create the wards and assign colors based on crime numbers for each overlay map layer
  d3.json(geo_url, function(data) {
    L.geoJSON(data, {
      style: function(feature) {
        return {
          color: "white",
          fillColor: chooseColor(ward_2017[feature.properties.ward]),
          fillOpacity: 0.5,
          weight: 1.5
        };
      },
      onEachFeature: function(feature, layer) {
        layer.bindPopup("<h4>Ward: " + feature.properties.ward +
          "</h4><hr><p># of Total Crimes: " + ward_2017[feature.properties.ward] + "</p>")
      }
    }).addTo(map_2017)
  });

  d3.json(geo_url, function(data) {
    L.geoJSON(data, {
      style: function(feature) {
        return {
          color: "white",
          fillColor: chooseColor(ward_2018[feature.properties.ward]),
          fillOpacity: 0.5,
          weight: 1.5
        };
      },
      onEachFeature: function(feature, layer) {
        layer.bindPopup("<h4>Ward: " + feature.properties.ward +
          "</h4><hr><p># of Crimes: " + ward_2018[feature.properties.ward] + "</p>")
      }
    }).addTo(map_2018)
  });

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
          "</h4><hr><p>Change in Crime: " + (ward_2018[feature.properties.ward] - ward_2017[feature.properties.ward]) + 
          "</p>")
      }
    }).addTo(comparison_map)
  });

};

function updateCharts(crime) {
  if (crime === "ALL") {
    var url = "/all_crime_data";
  }
  else {
    var url = "/crime_data/" + crime
  }

  d3.json(url, function(response) {
    //buildLine(response["2017"]["monthly_crime"], response["2018"]["monthly_crime"]);
    buildMap(response["2017"]["ward_crime"], response["2018"]["ward_crime"]);
  });
};

function init() {
  updateCharts("ALL");
};

init();
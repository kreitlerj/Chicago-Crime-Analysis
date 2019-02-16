function buildMap(crime) {
  // Generate url based on dropdown selection
  // if (crime === "ALL") {
  //   url = "/all_crime_data";
  // }
  // else {
  //   url = "/crime_data/" + crime;
  // }

  // place holder url
  url = "/all_crime_data";

  // d3 GET request to pull in the ward crime data
  d3.json(url).then(function(response) {
    var ward_2017 = response["2017"]["ward_crime"];
    var ward_2018 = response["2018"]["ward_crime"];
    console.log(ward_2017);
    console.log(ward_2018);
  });

  

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

  // URL for geoJSON data
  geo_url = "https://data.cityofchicago.org/resource/k9yb-bpqx.json";

  // Create the wards and assign colors based on crime numbers for each overlay map layer
  d3.json(geo_url, function(data) {
    L.geoJSON(data, {
      style: function() {
        return {
          color: "black",
          fillColor: chooseColor(ward_2017[features.properties.ward]),
          fillOpacity: 70,
          weight = 1.5
        }
      }
    }).addTo(map_2017)
  })

  d3.json(geo_url, function(data) {
    L.geoJSON(data, {
      style: function() {
        return {
          color: "black",
          fillColor: chooseColor(ward_2018[features.properties.ward]),
          fillOpacity: 70,
          weight = 1.5
        }
      }
    }).addTo(map_2017)
  })

  d3.json(geo_url, function(data) {
    L.geoJSON(data, {
      style: function() {
        return {color: "orange", fillOpacity: 70}
      }
    }).addTo(comparison_map)
  })

}
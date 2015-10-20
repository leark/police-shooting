var map;
// Function to draw your map
var drawMap = function() {

  var accessT = "pk.eyJ1IjoibGVhcmsiLCJhIjoiY2lmdTBraXQ3MWU4cXVubHljNm9oOHJzNSJ9.Rt7eRBIErjZ1swddXQMAyw";
  var latitude = "37.4739856";
  var longitude = "-96.1837996";
  var zoom = "4";

  L.mapbox.accessToken = accessT;

  map = L.mapbox.map('container', 'mapbox.pencil').setView([latitude, longitude], zoom);

  
  // Create a map in the div #map
  // Create map and set view
  // Add the layer to your map
  // Execute your function to get data

  getData();
}

// Function for getting data
var data;

var getData = function() {

  // Execute an AJAX request to get the data in data/response.js
  $.ajax({
  	url: "data/response.json",
  	success: function(dat) {
      data = dat;
      customBuild();
    },
    dataType: "json"
  })
  // When your request is successful, call your customBuild function
}

// Loop through your data and add the appropriate layers and points
var customBuild = function() {
	// Be sure to add each layer to the map
  var Unknown = L.tileLayer()
  var layers = [];
  var layerNames = [];
  var male = 0;
  var female = 0;
  var whiteMale = 0;
  var whiteFemale = 0;

  var myIcon = L.divIcon({className: "markers"});

  $.each(data, function(i) {
    var report = data[i]; 

    var layer;
    if (report.Race != undefined) {
      layer = report.Race;
      if (report["Victim's Gender"] == "Male") {
        if (layer == "White") {
          whiteMale++;
        }
        male++;
      } else {
        if (layer == "White") {
          whiteFemale++;
        }
        female++;
      }
    } else {
      layer = "Unknown";
    }

    if ($.inArray(layer, layerNames) == -1) {
      layerNames.push(layer);
      layers.push(new L.LayerGroup([]));
    }
    
    var col = "grey";
    if (report["Hit or Killed?"] == "Killed") {
      col = "red";
    }

    var circle = new L.circleMarker([report.lat, report.lng], {color: col, radius: 5});

    //var circle = new L.marker([report.lat, report.lng], {icon: myIcon});

    var text = "State: " + report.State + "</br>";
    text += "City: " + report.City + "</br>";
    if (report["Victim Name"] != undefined) {
      text += "Victim's Name: " + report["Victim Name"] + "</br>";
    }
    text += "Gender: " + report["Victim's Gender"] + "</br>";
    
    if (report["Armed or Unarmed?"] == "Armed") {
      text += "Armed:" + report["Armed or Unarmed?"] + "</br>";
      text += "Weapon: " + report["Weapon"] + "</br>";
    } else {
      text += "Armed: Unarmed" + "</br>";
    }
    var summ = "" + report.Summary;
    text += "Summary: " + summ.substr(0, 200) + "...</br>";
    text += "<a href=" + report["Source Link"] + ">Source</a>";

    circle.bindPopup(text);

    layers[$.inArray(layer, layerNames)].addLayer(circle);
  })

  var overlay = {"Unknown": layers[0]};
  for (var i = 1; i <= layers.length - 1; i++) {
    overlay[layerNames[i]] = layers[i];
  };
  
  // Once layers are on the map, add a leaflet controller that shows/hides layers
  L.control.layers(null, overlay).addTo(map);

  var tableData = [["", "Men", "Women"],
                   ["White", whiteMale, whiteFemale], 
                   ["Non-White", male - whiteMale, female - whiteFemale]];

  var table = $("<table>").addClass("table table-striped");

  $.each(tableData, function(rowIndex, r) {
    var row = $("<tr>");
    $.each(r, function(colIndex, c) {
      if (rowIndex == 0) {
        row.append($("<th>").text(c));  
      } else {
        row.append($("<td>").text(c));
      }
    });
    table.append(row);
  });


  $(".content").append(table);

}



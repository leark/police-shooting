var map;
// Function to draw the map
var drawMap = function() {

  var accessT = "pk.eyJ1IjoibGVhcmsiLCJhIjoiY2lmdTBraXQ3MWU4cXVubHljNm9oOHJzNSJ9.Rt7eRBIErjZ1swddXQMAyw";
  var latitude = "37.4739856";
  var longitude = "-96.1837996";
  var zoom = "4";

  L.mapbox.accessToken = accessT;

  // Create a map in the div #container
  map = L.mapbox.map('container', 'mapbox.pencil').setView([latitude, longitude], zoom);
  
  getData();
}

// data is outside for customBuild to access it
var data;

// Function for getting data
// calls customBuild when successful
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
}

// adds layers and points to the map and create the table with data
var customBuild = function() {

  var Unknown = L.tileLayer()
  var layers = [];
  var layerNames = [];
  var male = 0;
  var female = 0;
  var whiteMale = 0;
  var whiteFemale = 0;

  var myIcon = L.divIcon({className: "markers"});

  // looping through the data
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

    // adding layer to layerNames and layers if it does not exist
    if ($.inArray(layer, layerNames) == -1) {
      layerNames.push(layer);
      layers.push(new L.LayerGroup([]));
    }
    
    var col = "grey";
    // setting the color of circle to be red if person was killed
    if (report["Hit or Killed?"] == "Killed") {
      col = "red";
    }

    // creating the circle
    var circle = new L.circleMarker([report.lat, report.lng], {color: col, radius: 5});

    // creating the text for popup
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

  // adding layers to map
  var overlay = {};
  for (var i = 0; i <= layers.length - 1; i++) {
    layers[i].addTo(map);
    overlay[layerNames[i]] = layers[i];
  };
  
  // adding leaflet controller that shows/hides layers
  L.control.layers(null, overlay).addTo(map);


  var tableData = [["", "Men", "Women"],
                   ["White", whiteMale, whiteFemale], 
                   ["Non-White", male - whiteMale, female - whiteFemale]];

  var table = $("<table>").addClass("table table-striped");

  // creating the data table
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

  // adding table to html
  $(".content").append(table);
}



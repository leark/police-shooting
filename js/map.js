// Function to draw your map
var drawMap = function() {

  // Create map and set view
 
  var map = L.map('.container').setView([latitude, longitude], zoom);
  // Create a tile layer variable using the appropriate url
  var layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');

  // Add the layer to your map
 
  layer.addTo(map);
  // Execute your function to get data

  getData();
}

// Function for getting data
var getData = function() {

  // Execute an AJAX request to get the data in data/response.js

  $.ajax({
  	url: "data/response.json";
  	data: data,
  	success: success
  });
  // When your request is successful, call your customBuild function

}

// Loop through your data and add the appropriate layers and points
var customBuild = function() {
	// Be sure to add each layer to the map

	// Once layers are on the map, add a leaflet controller that shows/hides layers
  
}



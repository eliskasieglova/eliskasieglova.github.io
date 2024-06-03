// Initialize the map
var map = L.map('map').setView([78.6, 19], 5);

// Add tile layer from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to load GeoJSON data using AJAX
function loadGeoJSON() {
  // Make an AJAX request
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'RFresults.geojson', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      // Parse JSON response
      var geojsonData = JSON.parse(xhr.responseText);
      // Add GeoJSON layer to the map
      L.geoJSON(geojsonData).addTo(map);
    } else {
      console.error('Failed to load GeoJSON data.');
    }
  };
  xhr.send();
}

// Call the function to load GeoJSON data
loadGeoJSON();
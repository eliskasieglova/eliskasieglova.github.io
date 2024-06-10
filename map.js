// Initialize the map
var map = L.map('map').setView([78.6, 19], 5);

// Add tile layer from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add info that shows on hover
var info = L.control();
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
// Set names for surging and not surging
function isThisGlacierSurging(s) {
    if (s == 0) {
        r = 'no'
    } else if (s == 1) {
        r = 'yes'
    } else if (s == -999) {
        r = 'not enough data'
    } else {
        r = 'something unexpected happened, we do not have a response'
    }
    return r
};

info.update = function (props) {
    this._div.innerHTML = '<h4>is this glacier surging?</h4>' +  (props ?
        '<b>' + props.glacier_name + '</b><br />' + isThisGlacierSurging(props.surging) + ' '
        : 'hover over a glacier');
};

info.addTo(map);

// Set colors for surging/non surging glaciers
function getColor(d) {
    if (d == -999) {
        color = '#C2C2C2'
    } else if (d == 0) {
        color =  '#F3FFFF'
    } else if (d == 1) {
        color =  '#FF0022'
    } else {
        color = '#00FFFF'
    }
    return color
};

// Set style
function style(feature) {
    return {
        color: getColor(feature.properties.surging)
    };
};

// Add interaction
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
    info.update(layer.feature.properties);
    layer.bringToFront();
};

// Create layers for each year's geoJSON data
//var geojson = L.geoJSON(data, {style: style, onEachFeature: onEachFeature}).addTo(map);
var layer2023 = L.geoJSON(results2023, {style: style, onEachFeature: onEachFeature}).addTo(map);
var layer2022 = L.geoJSON(results2022, {style: style, onEachFeature: onEachFeature});
var layer2021 = L.geoJSON(results2021, {style: style, onEachFeature: onEachFeature});
var layer2020 = L.geoJSON(results2020, {style: style, onEachFeature: onEachFeature});
var layer2019 = L.geoJSON(results2019, {style: style, onEachFeature: onEachFeature});

// Create an object to hold the layers
var overlayMaps = {
    "2019": layer2019,
    "2020": layer2020,
    "2021": layer2021,
    "2022": layer2022,
    "2023": layer2023
};

// Add the layer control to the map
L.control.layers(null, overlayMaps).addTo(map);

function resetHighlight(e) {
    layer2023.resetStyle(e.target);
    info.update();
};

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
};

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

// Legend
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-999, 0, 1],
        labels = ['no data', 'not surging', 'surging'];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i]) + '"></i> ' +
            labels[i] + '<br> <br>';
        }

    return div;
};

legend.addTo(map);

// Title
    var title = L.control({position: 'topleft'});
    title.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'map-title');
        div.innerHTML = 'Svalbard Surges';
        return div;
    };

    title.addTo(map);


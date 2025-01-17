// Initialize the map
var map = L.map('map').setView([78.6, 19], 5);

// Add tile layer from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


// Title
var title = L.control({position: 'topleft'});
title.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'map-title');
    div.innerHTML = 'Svalbard Surges';
    return div;
};

title.addTo(map);

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
        '<b>' + props.glacier_name + '</b><br/>' + isThisGlacierSurging(props.surging) + ' '
        + '(probability: ' + props.probability + ', QF: ' + props.quality_flag + ')'
        : 'hover over a glacier');
};


info.addTo(map);

// Add point plots to map
var plot = L.control();
plot.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'plot'); // create a div with a class "info"
    this.showimg();
    return this._div;
};

plot.showimg = function (props) {
    this._div.innerHTML = (props ?
        '<img src="imgs/' + props.glacier_id + '_' + props.year + '.png">'+ ' '
        : '');
};

plot.addTo(map);

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
    plot.showimg(layer.feature.properties);
    layer.bringToFront();
};

//var geojson = L.geoJSON(data, {style: style, onEachFeature: onEachFeature}).addTo(map);
var RF2023 = L.geoJSON(results2023, {style: style, onEachFeature: onEachFeature}).addTo(map);
var RF2022 = L.geoJSON(results2022, {style: style, onEachFeature: onEachFeature});
var RF2021 = L.geoJSON(results2021, {style: style, onEachFeature: onEachFeature});
var RF2020 = L.geoJSON(results2020, {style: style, onEachFeature: onEachFeature});
var RF2019 = L.geoJSON(results2019, {style: style, onEachFeature: onEachFeature});

// Create an object to hold the layers
var overlayMaps = {
    "RF 2019": RF2019,
    "RF 2020": RF2020,
    "RF 2021": RF2021,
    "RF 2022": RF2022,
    "RF 2023": RF2023,
};

// Add the layer control to the map
L.control.layers(null, overlayMaps).addTo(map);

function resetHighlight(e) {
    RF2023.resetStyle(e.target);
    info.update();
    plot.showimg();
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
};

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


// Add your own mapboxgl access token between the quotes
mapboxgl.accessToken = 'pk.eyJ1IjoicmpkdXJzdCIsImEiOiJja3k3aXNuMmwxNjR1MndxOW5wOWtscXFqIn0.eAKZrUdm3qQTw3GHUT_tag';

const buses = {};

const bus_colors = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "white",
  "black"
];

// This is the map instance
let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/satellite-streets-v11',
  center: [-71.104081, 42.365554],
  zoom: 14,
});

// Make a function that makes markers for each bus
const makeMarker = function (number, color, lng, lat) {
  return new mapboxgl.Marker({"color": color, "marker-symbol": number})
    .setLngLat([lng, lat])
    .addTo(map);
};

// move marker
const updateMarker = function (marker, lng, lat) {
  marker.setLngLat([lng, lat]);
};

async function run(){
  // get bus data    
  const locations = await getBusLocations();
  //console.log(new Date());
  //console.log(locations);

  locations.forEach((bus, i) => {
    if (buses[bus.attributes.label]) {
      updateMarker(buses[bus.attributes.label], bus.attributes.longitude, bus.attributes.latitude);
   } else {
      buses[bus.attributes.label] = makeMarker(i + 1, bus_colors[i], bus.attributes.longitude, bus.attributes.latitude);
   }; 
  });
  // timer
  setTimeout(run, 15000);
};

// Request bus data from MBTA
async function getBusLocations(){
const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
const response = await fetch(url);
const json     = await response.json();
return json.data;
};

run();

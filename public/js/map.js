
let MAP_TOKEN = mapToken;
console.log(mapToken)
mapboxgl.accessToken = mapToken
{/* // TO MAKE THE MAP APPEAR YOU MUST */ }
{/* // ADD YOUR ACCESS TOKEN FROM */ }
{/* // https://account.mapbox.com */ }
const map = new mapboxgl.Map({
    container: 'map',
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/streets-v12', //style URL
    center: [72.68333000, 23.21667000], //starting position [longti,lat]  ki postion ae map khule
    zoom: 9 //starting Zoom
});
console.log(coodinates);

    // Create a default Marker and add it to the map.
    // const marker1 = new mapboxgl.Marker()
    //     .setLngLat([coodinates]) //Model_listing.js->Geomatery.Coordinates ave
    //     .addTo(map);
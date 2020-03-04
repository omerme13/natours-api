const displayMap = locations => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoib21lcm1lMTMiLCJhIjoiY2s3YzAydGNkMGlxOTNmbnphZnZudGdqMCJ9.l3uPAamz4Ue3SH7yTGxt3A';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/omerme13/ck7c07rhp013i1iluk9hafil9',
        scrollZoom: false
        // interactive: false
        // center: [-118.11, 34.11],
        // zoom: 4,
    });
    
    const bounds = new mapboxgl.LngLatBounds();
    
    for (let loc of locations) {
        const newElement = document.createElement('div');
        newElement.className = 'marker';
    
        const marker = new mapboxgl.Marker({
            element: newElement,
            anchor: 'bottom'
        });
        const popup = new mapboxgl.Popup({ offset: 35 });
    
        marker.setLngLat(loc.coordinates).addTo(map);
    
        popup
            .setLngLat(loc.coordinates)
            .setHTML(`day ${loc.day}: ${loc.description}`)
            .addTo(map);
    
        bounds.extend(loc.coordinates);
    }
    
    map.fitBounds(bounds, {
        padding: {
            top: 200,
            right: 100,
            bottom: 150,
            left: 100
        }
    });
};

export default displayMap;

//client side js 

let markers = [];

const loadContacts = async () => {
    console.log("loadContacts function called");
    // const response = await axios.get('/places');
    const tbody = document.querySelector('tbody');
    //delete all places
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    //delete all markers
    for (var i = 0; i < markers.length; i++) {
        map.removeLayer(markers[i]);
    }

    //adds updated version of places and markers
    if (response && response.data && response.data.places) {
        for (const place of response.data.places) {
            marker = L.marker([place.lat, place.lng]).addTo(map).bindPopup(`<b>${place.label}</b><br/>${place.address}`);
            markers.push(marker);
            // console.log(markers[0]);
            const tr = document.createElement('tr');
            tr.dataset.lat = place.lat;
            tr.dataset.lng = place.lng;
            tr.onclick = on_row_click;
            tr.innerHTML = `
                <td>${place.label}</td>
                <td>${place.address}</td>
                <td>
                    <button class='btn btn-danger' onclick='deletePlace(${place.id})'>Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        }
    }
}

const on_row_click = (e) => {
    // console.log(e.target) // this is the element clicked
    // console.log(e.target.tagName) // prints the element type (ie. TD)
    let row = e.target;
    if (e.target.tagName.toUpperCase() === 'TD') {
        row = e.target.parentNode;
        console.log(row)
    }
    const lat = parseFloat(row.dataset.lat);
    const lng = parseFloat(row.dataset.lng);
    map.flyTo(new L.LatLng(lat, lng));
 }


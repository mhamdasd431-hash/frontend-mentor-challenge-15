const searchInput = document.getElementById("search-input");
const searchForm = document.querySelector(".search-form");

const ipAddressElement = document.getElementById("ip-address");
const ipLocationElement = document.getElementById("ip-location");
const ipTimezoneElement = document.getElementById("ip-timezone");
const ipIspElement = document.getElementById("ip-isp");

const map = L.map('map').setView([0, 0], 13);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, and others',
    maxZoom: 19
}).addTo(map);

const marker = L.marker([0, 0]).addTo(map);

async function fetchIpData(query = "") {
    try {
        let url = `https://ipwho.is/${query}`;
        let response = await fetch(url);
        let data = await response.json();
        
        if (!data.success) {
            throw new Error("Failed to fetch IP data");
        }
        
        ipAddressElement.textContent = data.ip;
        ipLocationElement.textContent = `${data.city}, ${data.region}`;
        ipTimezoneElement.textContent = `UTC ${data.timezone.utc}`;
        ipIspElement.textContent = data.connection.isp;

        const lat = data.latitude;
        const lng = data.longitude;

        map.setView([lat, lng], 13);
        marker.setLatLng([lat, lng]);

    } catch (error) {
        console.log(error);
    }
}

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let searchValue = searchInput.value.trim();
    if (searchValue !== "") {
        fetchIpData(searchValue);
    }
});

fetchIpData();
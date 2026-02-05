const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to get Azure regions data
// Windows 365 and AVD availability based on Microsoft documentation
app.get('/api/regions', (req, res) => {
  const regions = [
    // North America
    { name: "East US", code: "eastus", location: "Virginia", geography: "North America", lat: 37.3719, lng: -79.8164, w365: true, avd: true },
    { name: "East US 2", code: "eastus2", location: "Virginia", geography: "North America", lat: 36.6681, lng: -78.3889, w365: true, avd: true },
    { name: "Central US", code: "centralus", location: "Iowa", geography: "North America", lat: 41.5908, lng: -93.6208, w365: true, avd: true },
    { name: "North Central US", code: "northcentralus", location: "Illinois", geography: "North America", lat: 41.8819, lng: -87.6278, w365: false, avd: true },
    { name: "South Central US", code: "southcentralus", location: "Texas", geography: "North America", lat: 29.4167, lng: -98.5, w365: true, avd: true },
    { name: "West US", code: "westus", location: "California", geography: "North America", lat: 37.783, lng: -122.417, w365: false, avd: true },
    { name: "West US 2", code: "westus2", location: "Washington", geography: "North America", lat: 47.233, lng: -119.852, w365: true, avd: true },
    { name: "West US 3", code: "westus3", location: "Phoenix", geography: "North America", lat: 33.448, lng: -112.074, w365: true, avd: true },
    { name: "West Central US", code: "westcentralus", location: "Wyoming", geography: "North America", lat: 40.890, lng: -110.234, w365: false, avd: true },
    { name: "Canada Central", code: "canadacentral", location: "Toronto", geography: "North America", lat: 43.653, lng: -79.383, w365: true, avd: true },
    { name: "Canada East", code: "canadaeast", location: "Quebec", geography: "North America", lat: 46.817, lng: -71.217, w365: false, avd: true },
    { name: "Mexico Central", code: "mexicocentral", location: "Querétaro", geography: "North America", lat: 20.588, lng: -100.389, w365: false, avd: true },

    // Europe
    { name: "North Europe", code: "northeurope", location: "Ireland", geography: "Europe", lat: 53.3478, lng: -6.2597, w365: true, avd: true },
    { name: "West Europe", code: "westeurope", location: "Netherlands", geography: "Europe", lat: 52.3667, lng: 4.9, w365: true, avd: true },
    { name: "UK South", code: "uksouth", location: "London", geography: "Europe", lat: 51.5074, lng: -0.1278, w365: true, avd: true },
    { name: "UK West", code: "ukwest", location: "Cardiff", geography: "Europe", lat: 51.4816, lng: -3.1791, w365: false, avd: true },
    { name: "France Central", code: "francecentral", location: "Paris", geography: "Europe", lat: 48.8566, lng: 2.3522, w365: true, avd: true },
    { name: "France South", code: "francesouth", location: "Marseille", geography: "Europe", lat: 43.2965, lng: 5.3698, w365: false, avd: true },
    { name: "Germany West Central", code: "germanywestcentral", location: "Frankfurt", geography: "Europe", lat: 50.1109, lng: 8.6821, w365: true, avd: true },
    { name: "Germany North", code: "germanynorth", location: "Berlin", geography: "Europe", lat: 52.52, lng: 13.405, w365: false, avd: true },
    { name: "Switzerland North", code: "switzerlandnorth", location: "Zurich", geography: "Europe", lat: 47.3769, lng: 8.5417, w365: true, avd: true },
    { name: "Switzerland West", code: "switzerlandwest", location: "Geneva", geography: "Europe", lat: 46.2044, lng: 6.1432, w365: false, avd: true },
    { name: "Norway East", code: "norwayeast", location: "Oslo", geography: "Europe", lat: 59.9139, lng: 10.7522, w365: true, avd: true },
    { name: "Norway West", code: "norwaywest", location: "Norway", geography: "Europe", lat: 58.97, lng: 5.7331, w365: false, avd: true },
    { name: "Sweden Central", code: "swedencentral", location: "Gävle", geography: "Europe", lat: 60.6749, lng: 17.1413, w365: true, avd: true },
    { name: "Poland Central", code: "polandcentral", location: "Warsaw", geography: "Europe", lat: 52.2297, lng: 21.0122, w365: true, avd: true },
    { name: "Italy North", code: "italynorth", location: "Milan", geography: "Europe", lat: 45.4642, lng: 9.19, w365: true, avd: true },
    { name: "Spain Central", code: "spaincentral", location: "Madrid", geography: "Europe", lat: 40.4168, lng: -3.7038, w365: true, avd: true },

    // Asia Pacific
    { name: "East Asia", code: "eastasia", location: "Hong Kong", geography: "Asia Pacific", lat: 22.267, lng: 114.188, w365: true, avd: true },
    { name: "Southeast Asia", code: "southeastasia", location: "Singapore", geography: "Asia Pacific", lat: 1.283, lng: 103.833, w365: true, avd: true },
    { name: "Japan East", code: "japaneast", location: "Tokyo", geography: "Asia Pacific", lat: 35.68, lng: 139.77, w365: true, avd: true },
    { name: "Japan West", code: "japanwest", location: "Osaka", geography: "Asia Pacific", lat: 34.6937, lng: 135.5022, w365: false, avd: true },
    { name: "Korea Central", code: "koreacentral", location: "Seoul", geography: "Asia Pacific", lat: 37.5665, lng: 126.978, w365: true, avd: true },
    { name: "Korea South", code: "koreasouth", location: "Busan", geography: "Asia Pacific", lat: 35.1796, lng: 129.0756, w365: false, avd: true },
    { name: "Central India", code: "centralindia", location: "Pune", geography: "Asia Pacific", lat: 18.5204, lng: 73.8567, w365: true, avd: true },
    { name: "South India", code: "southindia", location: "Chennai", geography: "Asia Pacific", lat: 13.0827, lng: 80.2707, w365: false, avd: true },
    { name: "West India", code: "westindia", location: "Mumbai", geography: "Asia Pacific", lat: 19.076, lng: 72.8777, w365: false, avd: true },
    { name: "Indonesia Central", code: "indonesiacentral", location: "Jakarta", geography: "Asia Pacific", lat: -6.2088, lng: 106.8456, w365: false, avd: true },
    { name: "Malaysia West", code: "malaysiawest", location: "Kuala Lumpur", geography: "Asia Pacific", lat: 3.139, lng: 101.6869, w365: false, avd: true },

    // Australia & New Zealand
    { name: "Australia East", code: "australiaeast", location: "New South Wales", geography: "Australia", lat: -33.86, lng: 151.2094, w365: true, avd: true },
    { name: "Australia Southeast", code: "australiasoutheast", location: "Victoria", geography: "Australia", lat: -37.8136, lng: 144.9631, w365: false, avd: true },
    { name: "Australia Central", code: "australiacentral", location: "Canberra", geography: "Australia", lat: -35.3075, lng: 149.1244, w365: false, avd: true },
    { name: "Australia Central 2", code: "australiacentral2", location: "Canberra", geography: "Australia", lat: -35.3075, lng: 149.1244, w365: false, avd: false },
    { name: "New Zealand North", code: "newzealandnorth", location: "Auckland", geography: "Australia", lat: -36.8485, lng: 174.7633, w365: false, avd: true },

    // Middle East & Africa
    { name: "UAE North", code: "uaenorth", location: "Dubai", geography: "Middle East", lat: 25.2048, lng: 55.2708, w365: true, avd: true },
    { name: "UAE Central", code: "uaecentral", location: "Abu Dhabi", geography: "Middle East", lat: 24.4539, lng: 54.3773, w365: false, avd: true },
    { name: "Qatar Central", code: "qatarcentral", location: "Doha", geography: "Middle East", lat: 25.2854, lng: 51.531, w365: false, avd: true },
    { name: "Israel Central", code: "israelcentral", location: "Israel", geography: "Middle East", lat: 31.0461, lng: 34.8516, w365: false, avd: true },
    { name: "South Africa North", code: "southafricanorth", location: "Johannesburg", geography: "Africa", lat: -26.2041, lng: 28.0473, w365: true, avd: true },
    { name: "South Africa West", code: "southafricawest", location: "Cape Town", geography: "Africa", lat: -33.9249, lng: 18.4241, w365: false, avd: true },

    // South America
    { name: "Brazil South", code: "brazilsouth", location: "São Paulo", geography: "South America", lat: -23.55, lng: -46.633, w365: true, avd: true },
    { name: "Brazil Southeast", code: "brazilsoutheast", location: "Rio", geography: "South America", lat: -22.9068, lng: -43.1729, w365: false, avd: true },
    { name: "Chile Central", code: "chilecentral", location: "Santiago", geography: "South America", lat: -33.4489, lng: -70.6693, w365: false, avd: true }
  ];

  res.json(regions);
});

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Azure Latency Checker running at http://localhost:${port}`);
});

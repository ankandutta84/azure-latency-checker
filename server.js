const express = require('express');
const path = require('path');
const { getServiceAvailability, refreshServiceAvailability } = require('./azureService');
const { getOutageStatus, refreshOutageStatus } = require('./outageService');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Static region data (coordinates, names, geography)
// W365 and AVD availability will be fetched from Azure API when configured
const BASE_REGIONS = [
  // North America
  { name: "East US", code: "eastus", location: "Virginia", geography: "North America", lat: 37.3719, lng: -79.8164 },
  { name: "East US 2", code: "eastus2", location: "Virginia", geography: "North America", lat: 36.6681, lng: -78.3889 },
  { name: "Central US", code: "centralus", location: "Iowa", geography: "North America", lat: 41.5908, lng: -93.6208 },
  { name: "North Central US", code: "northcentralus", location: "Illinois", geography: "North America", lat: 41.8819, lng: -87.6278 },
  { name: "South Central US", code: "southcentralus", location: "Texas", geography: "North America", lat: 29.4167, lng: -98.5 },
  { name: "West US", code: "westus", location: "California", geography: "North America", lat: 37.783, lng: -122.417 },
  { name: "West US 2", code: "westus2", location: "Washington", geography: "North America", lat: 47.233, lng: -119.852 },
  { name: "West US 3", code: "westus3", location: "Phoenix", geography: "North America", lat: 33.448, lng: -112.074 },
  { name: "West Central US", code: "westcentralus", location: "Wyoming", geography: "North America", lat: 40.890, lng: -110.234 },
  { name: "Canada Central", code: "canadacentral", location: "Toronto", geography: "North America", lat: 43.653, lng: -79.383 },
  { name: "Canada East", code: "canadaeast", location: "Quebec", geography: "North America", lat: 46.817, lng: -71.217 },
  { name: "Mexico Central", code: "mexicocentral", location: "Querétaro", geography: "North America", lat: 20.588, lng: -100.389 },

  // Europe
  { name: "North Europe", code: "northeurope", location: "Ireland", geography: "Europe", lat: 53.3478, lng: -6.2597 },
  { name: "West Europe", code: "westeurope", location: "Netherlands", geography: "Europe", lat: 52.3667, lng: 4.9 },
  { name: "UK South", code: "uksouth", location: "London", geography: "Europe", lat: 51.5074, lng: -0.1278 },
  { name: "UK West", code: "ukwest", location: "Cardiff", geography: "Europe", lat: 51.4816, lng: -3.1791 },
  { name: "France Central", code: "francecentral", location: "Paris", geography: "Europe", lat: 48.8566, lng: 2.3522 },
  { name: "France South", code: "francesouth", location: "Marseille", geography: "Europe", lat: 43.2965, lng: 5.3698 },
  { name: "Germany West Central", code: "germanywestcentral", location: "Frankfurt", geography: "Europe", lat: 50.1109, lng: 8.6821 },
  { name: "Germany North", code: "germanynorth", location: "Berlin", geography: "Europe", lat: 52.52, lng: 13.405 },
  { name: "Switzerland North", code: "switzerlandnorth", location: "Zurich", geography: "Europe", lat: 47.3769, lng: 8.5417 },
  { name: "Switzerland West", code: "switzerlandwest", location: "Geneva", geography: "Europe", lat: 46.2044, lng: 6.1432 },
  { name: "Norway East", code: "norwayeast", location: "Oslo", geography: "Europe", lat: 59.9139, lng: 10.7522 },
  { name: "Norway West", code: "norwaywest", location: "Norway", geography: "Europe", lat: 58.97, lng: 5.7331 },
  { name: "Sweden Central", code: "swedencentral", location: "Gävle", geography: "Europe", lat: 60.6749, lng: 17.1413 },
  { name: "Poland Central", code: "polandcentral", location: "Warsaw", geography: "Europe", lat: 52.2297, lng: 21.0122 },
  { name: "Italy North", code: "italynorth", location: "Milan", geography: "Europe", lat: 45.4642, lng: 9.19 },
  { name: "Spain Central", code: "spaincentral", location: "Madrid", geography: "Europe", lat: 40.4168, lng: -3.7038 },

  // Asia Pacific
  { name: "East Asia", code: "eastasia", location: "Hong Kong", geography: "Asia Pacific", lat: 22.267, lng: 114.188 },
  { name: "Southeast Asia", code: "southeastasia", location: "Singapore", geography: "Asia Pacific", lat: 1.283, lng: 103.833 },
  { name: "Japan East", code: "japaneast", location: "Tokyo", geography: "Asia Pacific", lat: 35.68, lng: 139.77 },
  { name: "Japan West", code: "japanwest", location: "Osaka", geography: "Asia Pacific", lat: 34.6937, lng: 135.5022 },
  { name: "Korea Central", code: "koreacentral", location: "Seoul", geography: "Asia Pacific", lat: 37.5665, lng: 126.978 },
  { name: "Korea South", code: "koreasouth", location: "Busan", geography: "Asia Pacific", lat: 35.1796, lng: 129.0756 },
  { name: "Central India", code: "centralindia", location: "Pune", geography: "Asia Pacific", lat: 18.5204, lng: 73.8567 },
  { name: "South India", code: "southindia", location: "Chennai", geography: "Asia Pacific", lat: 13.0827, lng: 80.2707 },
  { name: "West India", code: "westindia", location: "Mumbai", geography: "Asia Pacific", lat: 19.076, lng: 72.8777 },
  { name: "Indonesia Central", code: "indonesiacentral", location: "Jakarta", geography: "Asia Pacific", lat: -6.2088, lng: 106.8456 },
  { name: "Malaysia West", code: "malaysiawest", location: "Kuala Lumpur", geography: "Asia Pacific", lat: 3.139, lng: 101.6869 },

  // Australia & New Zealand
  { name: "Australia East", code: "australiaeast", location: "New South Wales", geography: "Australia", lat: -33.86, lng: 151.2094 },
  { name: "Australia Southeast", code: "australiasoutheast", location: "Victoria", geography: "Australia", lat: -37.8136, lng: 144.9631 },
  { name: "Australia Central", code: "australiacentral", location: "Canberra", geography: "Australia", lat: -35.3075, lng: 149.1244 },
  { name: "Australia Central 2", code: "australiacentral2", location: "Canberra", geography: "Australia", lat: -35.3075, lng: 149.1244 },
  { name: "New Zealand North", code: "newzealandnorth", location: "Auckland", geography: "Australia", lat: -36.8485, lng: 174.7633 },

  // Middle East & Africa
  { name: "UAE North", code: "uaenorth", location: "Dubai", geography: "Middle East", lat: 25.2048, lng: 55.2708 },
  { name: "UAE Central", code: "uaecentral", location: "Abu Dhabi", geography: "Middle East", lat: 24.4539, lng: 54.3773 },
  { name: "Qatar Central", code: "qatarcentral", location: "Doha", geography: "Middle East", lat: 25.2854, lng: 51.531 },
  { name: "Israel Central", code: "israelcentral", location: "Israel", geography: "Middle East", lat: 31.0461, lng: 34.8516 },
  { name: "South Africa North", code: "southafricanorth", location: "Johannesburg", geography: "Africa", lat: -26.2041, lng: 28.0473 },
  { name: "South Africa West", code: "southafricawest", location: "Cape Town", geography: "Africa", lat: -33.9249, lng: 18.4241 },

  // South America
  { name: "Brazil South", code: "brazilsouth", location: "São Paulo", geography: "South America", lat: -23.55, lng: -46.633 },
  { name: "Brazil Southeast", code: "brazilsoutheast", location: "Rio", geography: "South America", lat: -22.9068, lng: -43.1729 },
  { name: "Chile Central", code: "chilecentral", location: "Santiago", geography: "South America", lat: -33.4489, lng: -70.6693 }
];

// Default/fallback service availability (used when Azure API is not configured)
const DEFAULT_W365_REGIONS = new Set([
  'eastus', 'eastus2', 'centralus', 'southcentralus', 'westus2', 'westus3',
  'canadacentral', 'northeurope', 'westeurope', 'uksouth', 'francecentral',
  'germanywestcentral', 'switzerlandnorth', 'norwayeast', 'swedencentral',
  'polandcentral', 'italynorth', 'spaincentral', 'eastasia', 'southeastasia',
  'japaneast', 'koreacentral', 'centralindia', 'australiaeast', 'uaenorth',
  'southafricanorth', 'brazilsouth'
]);

const DEFAULT_AVD_REGIONS = new Set([
  'eastus', 'eastus2', 'centralus', 'northcentralus', 'southcentralus',
  'westus', 'westus2', 'westus3', 'westcentralus', 'canadacentral', 'canadaeast',
  'mexicocentral', 'northeurope', 'westeurope', 'uksouth', 'ukwest',
  'francecentral', 'francesouth', 'germanywestcentral', 'germanynorth',
  'switzerlandnorth', 'switzerlandwest', 'norwayeast', 'norwaywest',
  'swedencentral', 'polandcentral', 'italynorth', 'spaincentral', 'eastasia',
  'southeastasia', 'japaneast', 'japanwest', 'koreacentral', 'koreasouth',
  'centralindia', 'southindia', 'westindia', 'indonesiacentral', 'malaysiawest',
  'australiaeast', 'australiasoutheast', 'australiacentral', 'newzealandnorth',
  'uaenorth', 'uaecentral', 'qatarcentral', 'israelcentral', 'southafricanorth',
  'southafricawest', 'brazilsouth', 'brazilsoutheast', 'chilecentral'
]);

// Minimum expected regions for services (used to detect incomplete API data)
const MIN_EXPECTED_W365_REGIONS = 20;
const MIN_EXPECTED_AVD_REGIONS = 40;

// API endpoint to get Azure regions data with dynamic service availability
app.get('/api/regions', async (req, res) => {
  try {
    // Try to get service availability from Azure API
    const { w365Regions, avdRegions } = await getServiceAvailability();

    // Use Azure data only if it returns a reasonable number of regions
    // The Azure Resource Provider API may return subscription-specific data
    // which could be incomplete compared to actual public availability
    const useW365 = w365Regions.size >= MIN_EXPECTED_W365_REGIONS
      ? w365Regions
      : DEFAULT_W365_REGIONS;
    const useAvd = avdRegions.size >= MIN_EXPECTED_AVD_REGIONS
      ? avdRegions
      : DEFAULT_AVD_REGIONS;

    // Build regions with service availability
    const regions = BASE_REGIONS.map(region => ({
      ...region,
      w365: useW365.has(region.code),
      avd: useAvd.has(region.code)
    }));

    // Log data source info
    const w365Source = w365Regions.size >= MIN_EXPECTED_W365_REGIONS ? 'live' : 'default';
    const avdSource = avdRegions.size >= MIN_EXPECTED_AVD_REGIONS ? 'live' : 'default';
    console.log(`Served regions - W365: ${w365Source} (${useW365.size}), AVD: ${avdSource} (${useAvd.size})`);

    res.json(regions);
  } catch (error) {
    console.error('Error in /api/regions:', error);

    // Fallback to default data on error
    const regions = BASE_REGIONS.map(region => ({
      ...region,
      w365: DEFAULT_W365_REGIONS.has(region.code),
      avd: DEFAULT_AVD_REGIONS.has(region.code)
    }));

    res.json(regions);
  }
});

// API endpoint to force refresh service availability from Azure
app.post('/api/refresh-availability', async (req, res) => {
  try {
    const result = await refreshServiceAvailability();
    res.json({
      success: true,
      w365Count: result.w365Regions.size,
      avdCount: result.avdRegions.size
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// API endpoint to get outage status from Azure Status and Downdetector
app.get('/api/outages', async (req, res) => {
  try {
    const status = await getOutageStatus();

    // Combine all issues
    const allIssues = [
      ...(status.azureStatus?.issues || []),
      ...(status.downdetector?.issues || [])
    ];

    res.json({
      success: true,
      hasIssues: allIssues.length > 0,
      issues: allIssues,
      lastUpdated: status.lastUpdated,
      sources: {
        azureStatus: {
          available: !status.azureStatus?.error,
          issueCount: status.azureStatus?.issues?.length || 0
        },
        downdetector: {
          available: !status.downdetector?.error,
          issueCount: status.downdetector?.issues?.length || 0
        }
      }
    });
  } catch (error) {
    console.error('Error in /api/outages:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// API endpoint to force refresh outage status
app.post('/api/refresh-outages', async (req, res) => {
  try {
    const status = await refreshOutageStatus();
    const allIssues = [
      ...(status.azureStatus?.issues || []),
      ...(status.downdetector?.issues || [])
    ];

    res.json({
      success: true,
      hasIssues: allIssues.length > 0,
      issueCount: allIssues.length,
      lastUpdated: status.lastUpdated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize service availability on startup (non-blocking)
(async () => {
  console.log('Initializing Azure service availability...');
  try {
    const { w365Regions, avdRegions } = await getServiceAvailability();
    if (w365Regions.size > 0 || avdRegions.size > 0) {
      console.log(`Loaded live Azure data: W365=${w365Regions.size}, AVD=${avdRegions.size} regions`);
    } else {
      console.log('Using default service availability data (Azure API not configured or unavailable)');
    }
  } catch (error) {
    console.warn('Failed to initialize Azure service availability:', error.message);
  }
})();

app.listen(port, () => {
  console.log(`Azure Latency Checker running at http://localhost:${port}`);
});

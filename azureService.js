const { DefaultAzureCredential } = require('@azure/identity');

// Cache for service availability data
let serviceAvailabilityCache = {
    w365Regions: new Set(),
    avdRegions: new Set(),
    lastUpdated: null,
    cacheExpiry: 24 * 60 * 60 * 1000 // 24 hours
};

// Azure Management API endpoint
const AZURE_MANAGEMENT_URL = 'https://management.azure.com';

/**
 * Fetch resource provider locations from Azure Management API
 * @param {string} accessToken - Azure access token
 * @param {string} subscriptionId - Azure subscription ID
 * @param {string} providerNamespace - Resource provider namespace (e.g., Microsoft.CloudPC)
 * @returns {Promise<Set<string>>} Set of available region codes
 */
async function getProviderLocations(accessToken, subscriptionId, providerNamespace) {
    const url = `${AZURE_MANAGEMENT_URL}/subscriptions/${subscriptionId}/providers/${providerNamespace}?api-version=2023-07-01`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        console.error(`Failed to fetch ${providerNamespace}: ${response.status} ${response.statusText}`);
        return new Set();
    }

    const data = await response.json();
    const locations = new Set();

    // Extract locations from resource types
    if (data.resourceTypes) {
        for (const resourceType of data.resourceTypes) {
            if (resourceType.locations) {
                for (const location of resourceType.locations) {
                    // Convert display name to region code (e.g., "East US" -> "eastus")
                    const regionCode = location.toLowerCase().replace(/\s+/g, '');
                    locations.add(regionCode);
                }
            }
        }
    }

    return locations;
}

/**
 * Fetch service availability from Azure
 * @returns {Promise<{w365Regions: Set<string>, avdRegions: Set<string>}>}
 */
async function fetchServiceAvailability() {
    const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID;

    if (!subscriptionId) {
        console.warn('AZURE_SUBSCRIPTION_ID not set. Using cached/default data.');
        return null;
    }

    try {
        // Get access token using DefaultAzureCredential
        // This supports: environment variables, managed identity, Azure CLI, etc.
        const credential = new DefaultAzureCredential();
        const tokenResponse = await credential.getToken('https://management.azure.com/.default');
        const accessToken = tokenResponse.token;

        // Fetch Windows 365 (Microsoft.CloudPC) availability
        const w365Regions = await getProviderLocations(
            accessToken,
            subscriptionId,
            'Microsoft.CloudPC'
        );

        // Fetch AVD (Microsoft.DesktopVirtualization) availability
        const avdRegions = await getProviderLocations(
            accessToken,
            subscriptionId,
            'Microsoft.DesktopVirtualization'
        );

        console.log(`Fetched Azure service availability: W365=${w365Regions.size} regions, AVD=${avdRegions.size} regions`);

        return { w365Regions, avdRegions };
    } catch (error) {
        console.error('Error fetching Azure service availability:', error.message);
        return null;
    }
}

/**
 * Get service availability with caching
 * @returns {Promise<{w365Regions: Set<string>, avdRegions: Set<string>}>}
 */
async function getServiceAvailability() {
    const now = Date.now();

    // Return cached data if still valid
    if (serviceAvailabilityCache.lastUpdated &&
        (now - serviceAvailabilityCache.lastUpdated) < serviceAvailabilityCache.cacheExpiry) {
        return {
            w365Regions: serviceAvailabilityCache.w365Regions,
            avdRegions: serviceAvailabilityCache.avdRegions
        };
    }

    // Fetch fresh data
    const freshData = await fetchServiceAvailability();

    if (freshData) {
        serviceAvailabilityCache.w365Regions = freshData.w365Regions;
        serviceAvailabilityCache.avdRegions = freshData.avdRegions;
        serviceAvailabilityCache.lastUpdated = now;
        return freshData;
    }

    // Return existing cache if fetch failed
    if (serviceAvailabilityCache.lastUpdated) {
        console.warn('Using stale cache due to fetch failure');
        return {
            w365Regions: serviceAvailabilityCache.w365Regions,
            avdRegions: serviceAvailabilityCache.avdRegions
        };
    }

    // Return empty sets if no cache exists
    return { w365Regions: new Set(), avdRegions: new Set() };
}

/**
 * Check if a region supports a service
 * @param {string} regionCode - Azure region code (e.g., "eastus")
 * @param {Set<string>} serviceRegions - Set of regions supporting the service
 * @returns {boolean}
 */
function regionSupportsService(regionCode, serviceRegions) {
    return serviceRegions.has(regionCode);
}

/**
 * Force refresh the service availability cache
 */
async function refreshServiceAvailability() {
    serviceAvailabilityCache.lastUpdated = null;
    return await getServiceAvailability();
}

module.exports = {
    getServiceAvailability,
    refreshServiceAvailability,
    regionSupportsService
};

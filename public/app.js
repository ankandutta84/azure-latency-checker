// Azure Speed Test endpoints - Using Azure blob storage endpoints for latency testing
const AZURE_SPEED_TEST_ENDPOINTS = {
    eastus: 'https://azurespeedtesteastus.blob.core.windows.net',
    eastus2: 'https://azurespeedtesteastus2.blob.core.windows.net',
    centralus: 'https://azurespeedtestcentralus.blob.core.windows.net',
    northcentralus: 'https://azurespeedtestnorthcentralus.blob.core.windows.net',
    southcentralus: 'https://azurespeedtestsouthcentralus.blob.core.windows.net',
    westus: 'https://azurespeedtestwestus.blob.core.windows.net',
    westus2: 'https://azurespeedtestwestus2.blob.core.windows.net',
    westus3: 'https://azurespeedtestwestus3.blob.core.windows.net',
    westcentralus: 'https://azurespeedtestwestcentralus.blob.core.windows.net',
    canadacentral: 'https://azurespeedtestcanadacentral.blob.core.windows.net',
    canadaeast: 'https://azurespeedtestcanadaeast.blob.core.windows.net',
    mexicocentral: 'https://azurespeedtestmexicocentral.blob.core.windows.net',
    northeurope: 'https://azurespeedtestnortheurope.blob.core.windows.net',
    westeurope: 'https://azurespeedtestwesteurope.blob.core.windows.net',
    uksouth: 'https://azurespeedtestuksouth.blob.core.windows.net',
    ukwest: 'https://azurespeedtestukwest.blob.core.windows.net',
    francecentral: 'https://azurespeedtestfrancecentral.blob.core.windows.net',
    francesouth: 'https://azurespeedtestfrancesouth.blob.core.windows.net',
    germanywestcentral: 'https://azurespeedtestgermanywestcentral.blob.core.windows.net',
    germanynorth: 'https://azurespeedtestgermanynorth.blob.core.windows.net',
    switzerlandnorth: 'https://azurespeedtestswitzerlandnorth.blob.core.windows.net',
    switzerlandwest: 'https://azurespeedtestswitzerlandwest.blob.core.windows.net',
    norwayeast: 'https://azurespeedtestnorwayeast.blob.core.windows.net',
    norwaywest: 'https://azurespeedtestnorwaywest.blob.core.windows.net',
    swedencentral: 'https://azurespeedtestswedencentral.blob.core.windows.net',
    polandcentral: 'https://azurespeedtestpolandcentral.blob.core.windows.net',
    italynorth: 'https://azurespeedtestitaly.blob.core.windows.net',
    spaincentral: 'https://azurespeedtestspaincentral.blob.core.windows.net',
    eastasia: 'https://azurespeedtesteastasia.blob.core.windows.net',
    southeastasia: 'https://azurespeedtestsoutheastasia.blob.core.windows.net',
    japaneast: 'https://azurespeedtestjapaneast.blob.core.windows.net',
    japanwest: 'https://azurespeedtestjapanwest.blob.core.windows.net',
    koreacentral: 'https://azurespeedtestkoreacentral.blob.core.windows.net',
    koreasouth: 'https://azurespeedtestkoreasouth.blob.core.windows.net',
    centralindia: 'https://azurespeedtestcentralindia.blob.core.windows.net',
    southindia: 'https://azurespeedtestsouthindia.blob.core.windows.net',
    westindia: 'https://azurespeedtestwestindia.blob.core.windows.net',
    indonesiacentral: 'https://azurespeedtestindonesiacentral.blob.core.windows.net',
    malaysiawest: 'https://azurespeedtestmalaysiawest.blob.core.windows.net',
    australiaeast: 'https://azurespeedtestaustraliaeast.blob.core.windows.net',
    australiasoutheast: 'https://azurespeedtestaustraliaoutheast.blob.core.windows.net',
    australiacentral: 'https://azurespeedtestaustraliacentral.blob.core.windows.net',
    australiacentral2: 'https://azurespeedtestaustraliacentral2.blob.core.windows.net',
    newzealandnorth: 'https://azurespeedtestnewzealandnorth.blob.core.windows.net',
    uaenorth: 'https://azurespeedtestuaenorth.blob.core.windows.net',
    uaecentral: 'https://azurespeedtestuaecentral.blob.core.windows.net',
    qatarcentral: 'https://azurespeedtestqatarcentral.blob.core.windows.net',
    israelcentral: 'https://azurespeedtestisraelcentral.blob.core.windows.net',
    southafricanorth: 'https://azurespeedtestsouthafricanorth.blob.core.windows.net',
    southafricawest: 'https://azurespeedtestsouthafricawest.blob.core.windows.net',
    brazilsouth: 'https://azurespeedtestbrazilsouth.blob.core.windows.net',
    brazilsoutheast: 'https://azurespeedtestbrazilsoutheast.blob.core.windows.net',
    chilecentral: 'https://azurespeedtestchilecentral.blob.core.windows.net'
};

// Alternative: Use a simple timing-based approach
async function measureLatency(url) {
    const iterations = 3;
    const latencies = [];

    for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        try {
            // Use a HEAD request to minimize data transfer
            await fetch(url + '?t=' + Date.now(), {
                method: 'HEAD',
                mode: 'no-cors',
                cache: 'no-cache'
            });
            const end = performance.now();
            latencies.push(end - start);
        } catch (e) {
            // Still record the time even on CORS errors - the network round trip happened
            const end = performance.now();
            latencies.push(end - start);
        }
    }

    // Return median latency
    latencies.sort((a, b) => a - b);
    return Math.round(latencies[Math.floor(latencies.length / 2)]);
}

// State
let regions = [];
let latencyResults = {};
let isRunning = false;
let stopRequested = false;

// DOM Elements
const regionsGrid = document.getElementById('regionsGrid');
const startBtn = document.getElementById('startTest');
const stopBtn = document.getElementById('stopTest');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const fastestRegion = document.getElementById('fastestRegion');
const bestLatency = document.getElementById('bestLatency');
const regionsTested = document.getElementById('regionsTested');
const geographyFilter = document.getElementById('geographyFilter');
const sortBy = document.getElementById('sortBy');

// Get latency class based on value
function getLatencyClass(latency) {
    if (latency < 50) return 'excellent';
    if (latency < 100) return 'good';
    if (latency < 200) return 'fair';
    return 'poor';
}

// Get latency bar width (max 500ms = 100%)
function getLatencyBarWidth(latency) {
    return Math.min((latency / 500) * 100, 100);
}

// Create region card HTML
function createRegionCard(region) {
    const latency = latencyResults[region.code];
    const latencyClass = latency ? getLatencyClass(latency) : '';
    const latencyDisplay = latency || '--';
    const barWidth = latency ? getLatencyBarWidth(latency) : 0;

    return `
        <div class="region-card" id="card-${region.code}" data-geography="${region.geography}" data-latency="${latency || 9999}">
            <div class="region-header">
                <span class="region-name">${region.name}</span>
                <span class="region-badge">${region.geography}</span>
            </div>
            <div class="region-location">${region.location}</div>
            <div class="region-code">${region.code}</div>
            <div class="latency-display">
                <span class="latency-value ${latencyClass}">${latencyDisplay}</span>
                <span class="latency-unit">ms</span>
            </div>
            <div class="latency-bar">
                <div class="latency-bar-fill ${latencyClass}" style="width: ${barWidth}%"></div>
            </div>
        </div>
    `;
}

// Render regions
function renderRegions() {
    const filter = geographyFilter.value;
    const sort = sortBy.value;

    let filteredRegions = [...regions];

    // Filter by geography
    if (filter !== 'all') {
        filteredRegions = filteredRegions.filter(r => r.geography === filter);
    }

    // Sort
    if (sort === 'latency') {
        filteredRegions.sort((a, b) => {
            const latA = latencyResults[a.code] || 9999;
            const latB = latencyResults[b.code] || 9999;
            return latA - latB;
        });
    } else if (sort === 'name') {
        filteredRegions.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'geography') {
        filteredRegions.sort((a, b) => a.geography.localeCompare(b.geography));
    }

    regionsGrid.innerHTML = filteredRegions.map(createRegionCard).join('');
}

// Update card for a specific region
function updateRegionCard(regionCode) {
    const card = document.getElementById(`card-${regionCode}`);
    if (!card) return;

    const latency = latencyResults[regionCode];
    const latencyClass = getLatencyClass(latency);
    const barWidth = getLatencyBarWidth(latency);

    card.classList.remove('testing');
    card.dataset.latency = latency;

    const valueEl = card.querySelector('.latency-value');
    const barFill = card.querySelector('.latency-bar-fill');

    valueEl.textContent = latency;
    valueEl.className = `latency-value ${latencyClass}`;
    barFill.className = `latency-bar-fill ${latencyClass}`;
    barFill.style.width = `${barWidth}%`;
}

// Update stats
function updateStats() {
    const tested = Object.keys(latencyResults).length;
    regionsTested.textContent = `${tested} / ${regions.length}`;

    if (tested > 0) {
        const fastest = Object.entries(latencyResults).reduce((a, b) => a[1] < b[1] ? a : b);
        const region = regions.find(r => r.code === fastest[0]);
        fastestRegion.textContent = region ? region.name : fastest[0];
        bestLatency.textContent = `${fastest[1]} ms`;

        // Highlight fastest card
        document.querySelectorAll('.region-card').forEach(card => card.classList.remove('fastest'));
        const fastestCard = document.getElementById(`card-${fastest[0]}`);
        if (fastestCard) fastestCard.classList.add('fastest');
    }
}

// Start latency test
async function startLatencyTest() {
    isRunning = true;
    stopRequested = false;
    latencyResults = {};

    startBtn.disabled = true;
    stopBtn.disabled = false;
    progressContainer.classList.add('active');

    // Reset stats
    fastestRegion.textContent = '--';
    bestLatency.textContent = '-- ms';
    regionsTested.textContent = `0 / ${regions.length}`;

    renderRegions();

    for (let i = 0; i < regions.length; i++) {
        if (stopRequested) break;

        const region = regions[i];
        const endpoint = AZURE_SPEED_TEST_ENDPOINTS[region.code];

        if (!endpoint) continue;

        // Mark card as testing
        const card = document.getElementById(`card-${region.code}`);
        if (card) card.classList.add('testing');

        // Measure latency
        const latency = await measureLatency(endpoint);
        latencyResults[region.code] = latency;

        // Update UI
        updateRegionCard(region.code);
        updateStats();

        // Update progress
        const progress = Math.round(((i + 1) / regions.length) * 100);
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${progress}%`;

        // Re-sort if sorting by latency
        if (sortBy.value === 'latency') {
            renderRegions();
        }
    }

    isRunning = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    progressContainer.classList.remove('active');
}

// Stop test
function stopTest() {
    stopRequested = true;
    stopBtn.disabled = true;
}

// Load regions
async function loadRegions() {
    try {
        const response = await fetch('/api/regions');
        regions = await response.json();
        renderRegions();
        updateServiceCounts();
    } catch (error) {
        regionsGrid.innerHTML = '<div class="loading">Error loading regions. Please refresh the page.</div>';
    }
}

// Event listeners
startBtn.addEventListener('click', startLatencyTest);
stopBtn.addEventListener('click', stopTest);
geographyFilter.addEventListener('change', renderRegions);
sortBy.addEventListener('change', renderRegions);

// =====================
// City Search Feature
// =====================

// City Search DOM Elements
const citySearch = document.getElementById('citySearch');
const searchSuggestions = document.getElementById('searchSuggestions');
const nearestRegionsPanel = document.getElementById('nearestRegionsPanel');
const selectedCityName = document.getElementById('selectedCityName');
const nearestRegionsList = document.getElementById('nearestRegionsList');
const testNearestBtn = document.getElementById('testNearestBtn');

let selectedCity = null;
let nearestRegions = [];

// Render search suggestions
function renderSuggestions(cities) {
    if (cities.length === 0) {
        searchSuggestions.classList.remove('active');
        return;
    }

    searchSuggestions.innerHTML = cities.map(city => `
        <div class="suggestion-item" data-lat="${city.lat}" data-lng="${city.lng}" data-name="${city.name}" data-country="${city.country}">
            <span class="suggestion-city">${city.name}</span>
            <span class="suggestion-country">${city.country}</span>
        </div>
    `).join('');

    searchSuggestions.classList.add('active');
}

// Render nearest regions panel
function renderNearestRegions() {
    if (!selectedCity || nearestRegions.length === 0) {
        nearestRegionsPanel.classList.remove('active');
        return;
    }

    selectedCityName.textContent = `Nearest Azure regions to ${selectedCity.name}, ${selectedCity.country}`;
    testNearestBtn.disabled = false;

    nearestRegionsList.innerHTML = nearestRegions.map((region, index) => {
        const latency = latencyResults[region.code];
        const latencyText = latency ? `${latency} ms` : 'Not tested';
        const latencyClass = latency ? 'tested' : '';
        const rankClass = index === 0 ? 'rank-1' : '';

        // Service availability badges
        const w365Badge = region.w365
            ? '<span class="service-badge available" title="Windows 365 Available">W365 ✓</span>'
            : '<span class="service-badge unavailable" title="Windows 365 Not Available">W365 ✗</span>';
        const avdBadge = region.avd
            ? '<span class="service-badge available" title="Azure Virtual Desktop Available">AVD ✓</span>'
            : '<span class="service-badge unavailable" title="Azure Virtual Desktop Not Available">AVD ✗</span>';

        return `
            <div class="nearest-region-item ${rankClass}" data-code="${region.code}">
                <div class="nearest-region-info">
                    <h4>${region.name}</h4>
                    <p>${region.location}</p>
                    <div class="service-badges">${w365Badge}${avdBadge}</div>
                    <div class="nearest-region-latency ${latencyClass}">${latencyText}</div>
                </div>
                <div class="nearest-region-distance">
                    <span class="distance-value">${Math.round(region.distance)}</span>
                    <span class="distance-unit">km away</span>
                </div>
            </div>
        `;
    }).join('');

    nearestRegionsPanel.classList.add('active');
}

// Handle city selection
function selectCity(city) {
    selectedCity = city;
    citySearch.value = `${city.name}, ${city.country}`;
    searchSuggestions.classList.remove('active');

    // Find nearest regions
    nearestRegions = findNearestRegions(city.lat, city.lng, regions, 5);
    renderNearestRegions();
}

// Test nearest regions
async function testNearestRegions() {
    if (nearestRegions.length === 0) return;

    testNearestBtn.disabled = true;
    testNearestBtn.textContent = 'Testing...';

    for (const region of nearestRegions) {
        const endpoint = AZURE_SPEED_TEST_ENDPOINTS[region.code];
        if (!endpoint) continue;

        // Mark card as testing
        const card = document.getElementById(`card-${region.code}`);
        if (card) card.classList.add('testing');

        // Measure latency
        const latency = await measureLatency(endpoint);
        latencyResults[region.code] = latency;

        // Update UI
        updateRegionCard(region.code);
        updateStats();
    }

    // Sort nearest regions by latency (lowest first)
    nearestRegions.sort((a, b) => {
        const latA = latencyResults[a.code] || 9999;
        const latB = latencyResults[b.code] || 9999;
        return latA - latB;
    });

    // Update nearest regions panel with results
    renderNearestRegions();

    // Re-render main grid if sorting by latency
    if (sortBy.value === 'latency') {
        renderRegions();
    }

    testNearestBtn.disabled = false;
    testNearestBtn.textContent = 'Test Nearest 5';
}

// City search event listeners
citySearch.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (query.length < 2) {
        searchSuggestions.classList.remove('active');
        return;
    }

    const matches = searchCities(query);
    renderSuggestions(matches);
});

citySearch.addEventListener('focus', () => {
    const query = citySearch.value.trim();
    if (query.length >= 2) {
        const matches = searchCities(query);
        renderSuggestions(matches);
    }
});

searchSuggestions.addEventListener('click', (e) => {
    const item = e.target.closest('.suggestion-item');
    if (item) {
        selectCity({
            name: item.dataset.name,
            country: item.dataset.country,
            lat: parseFloat(item.dataset.lat),
            lng: parseFloat(item.dataset.lng)
        });
    }
});

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
        searchSuggestions.classList.remove('active');
    }
});

testNearestBtn.addEventListener('click', testNearestRegions);

// =====================
// Service Count Feature
// =====================

// Service Count DOM Elements
const w365Count = document.getElementById('w365Count');
const avdCount = document.getElementById('avdCount');
const w365Stat = document.getElementById('w365Stat');
const avdStat = document.getElementById('avdStat');
const serviceModal = document.getElementById('serviceModal');
const modalTitle = document.getElementById('modalTitle');
const modalRegionsList = document.getElementById('modalRegionsList');
const modalClose = document.getElementById('modalClose');

// Update service counts
function updateServiceCounts() {
    if (regions.length === 0) return;

    const w365Regions = regions.filter(r => r.w365);
    const avdRegions = regions.filter(r => r.avd);

    w365Count.textContent = w365Regions.length;
    avdCount.textContent = avdRegions.length;
}

// Show service regions modal
function showServiceModal(serviceType) {
    let filteredRegions = [];
    let title = '';

    if (serviceType === 'w365') {
        filteredRegions = regions.filter(r => r.w365);
        title = `Windows 365 Supported Regions (${filteredRegions.length})`;
    } else if (serviceType === 'avd') {
        filteredRegions = regions.filter(r => r.avd);
        title = `Azure Virtual Desktop Supported Regions (${filteredRegions.length})`;
    }

    // Sort by geography then by name
    filteredRegions.sort((a, b) => {
        if (a.geography !== b.geography) {
            return a.geography.localeCompare(b.geography);
        }
        return a.name.localeCompare(b.name);
    });

    modalTitle.textContent = title;

    // Group by geography
    const grouped = {};
    filteredRegions.forEach(region => {
        if (!grouped[region.geography]) {
            grouped[region.geography] = [];
        }
        grouped[region.geography].push(region);
    });

    // Render grouped regions
    let html = '';
    for (const [geography, geoRegions] of Object.entries(grouped)) {
        html += `
            <div class="modal-geography-group">
                <h3 class="modal-geography-title">${geography} (${geoRegions.length})</h3>
                <div class="modal-region-cards">
                    ${geoRegions.map(region => `
                        <div class="modal-region-card">
                            <div class="modal-region-name">${region.name}</div>
                            <div class="modal-region-location">${region.location}</div>
                            <div class="modal-region-code">${region.code}</div>
                            <div class="modal-service-badges">
                                ${region.w365 ? '<span class="service-badge available">W365</span>' : '<span class="service-badge unavailable">W365</span>'}
                                ${region.avd ? '<span class="service-badge available">AVD</span>' : '<span class="service-badge unavailable">AVD</span>'}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    modalRegionsList.innerHTML = html;
    serviceModal.classList.add('active');
}

// Close modal
function closeServiceModal() {
    serviceModal.classList.remove('active');
}

// Service count event listeners
w365Stat.addEventListener('click', () => showServiceModal('w365'));
avdStat.addEventListener('click', () => showServiceModal('avd'));
modalClose.addEventListener('click', closeServiceModal);
serviceModal.addEventListener('click', (e) => {
    if (e.target === serviceModal) {
        closeServiceModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && serviceModal.classList.contains('active')) {
        closeServiceModal();
    }
});


// Initialize
loadRegions();

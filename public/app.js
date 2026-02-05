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
    } catch (error) {
        regionsGrid.innerHTML = '<div class="loading">Error loading regions. Please refresh the page.</div>';
    }
}

// Event listeners
startBtn.addEventListener('click', startLatencyTest);
stopBtn.addEventListener('click', stopTest);
geographyFilter.addEventListener('change', renderRegions);
sortBy.addEventListener('change', renderRegions);

// Initialize
loadRegions();

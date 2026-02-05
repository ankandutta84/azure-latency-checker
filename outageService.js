/**
 * Outage Service - Fetches service status from Azure Status page and Downdetector
 */

// Keywords to filter for W365, AVD, and authentication related issues
const RELEVANT_KEYWORDS = [
    'windows 365', 'w365', 'cloud pc',
    'virtual desktop', 'avd', 'azure virtual desktop', 'wvd',
    'authentication', 'azure ad', 'entra', 'active directory', 'identity',
    'login', 'sign-in', 'signin', 'mfa', 'multi-factor'
];

// Cache for outage data
let outageCache = {
    azureStatus: null,
    downdetector: null,
    lastUpdated: null,
    cacheExpiry: 5 * 60 * 1000 // 5 minutes cache
};

/**
 * Check if text contains relevant keywords
 */
function isRelevantIssue(text) {
    if (!text) return false;
    const lowerText = text.toLowerCase();
    return RELEVANT_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

/**
 * Parse Azure Status RSS feed
 */
function parseAzureStatusRSS(xmlText) {
    const issues = [];

    // Simple XML parsing for RSS items
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/;
    const descRegex = /<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/;
    const pubDateRegex = /<pubDate>(.*?)<\/pubDate>/;
    const linkRegex = /<link>(.*?)<\/link>/;

    let match;
    while ((match = itemRegex.exec(xmlText)) !== null) {
        const item = match[1];

        const titleMatch = item.match(titleRegex);
        const descMatch = item.match(descRegex);
        const dateMatch = item.match(pubDateRegex);
        const linkMatch = item.match(linkRegex);

        const title = titleMatch ? (titleMatch[1] || titleMatch[2] || '') : '';
        const description = descMatch ? (descMatch[1] || descMatch[2] || '') : '';
        const pubDate = dateMatch ? dateMatch[1] : '';
        const link = linkMatch ? linkMatch[1] : '';

        // Check if this issue is relevant to our services
        if (isRelevantIssue(title) || isRelevantIssue(description)) {
            issues.push({
                title: title.trim(),
                description: description.trim().substring(0, 500), // Limit description length
                date: pubDate,
                link: link.trim(),
                source: 'Azure Status'
            });
        }
    }

    return issues;
}

/**
 * Fetch Azure Status from RSS feed
 */
async function fetchAzureStatus() {
    const AZURE_STATUS_RSS = 'https://status.azure.com/en-us/status/feed';

    try {
        const response = await fetch(AZURE_STATUS_RSS, {
            headers: {
                'User-Agent': 'Azure-Latency-Checker/1.0'
            }
        });

        if (!response.ok) {
            console.error('Azure Status RSS fetch failed:', response.status);
            return { issues: [], error: null };
        }

        const xmlText = await response.text();
        const issues = parseAzureStatusRSS(xmlText);

        // Only return recent issues (last 7 days)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentIssues = issues.filter(issue => {
            if (!issue.date) return true;
            try {
                const issueDate = new Date(issue.date);
                return issueDate >= sevenDaysAgo;
            } catch {
                return true;
            }
        });

        return { issues: recentIssues, error: null };
    } catch (error) {
        console.error('Error fetching Azure Status:', error.message);
        return { issues: [], error: error.message };
    }
}

/**
 * Fetch Downdetector status by scraping the page
 */
async function fetchDowndetectorStatus() {
    // Downdetector URLs for Azure services
    const urls = [
        { url: 'https://downdetector.com/status/windows-azure/', service: 'Azure' },
        { url: 'https://downdetector.com/status/azure-active-directory/', service: 'Azure AD / Entra ID' }
    ];

    const issues = [];

    for (const { url, service } of urls) {
        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5'
                }
            });

            if (!response.ok) {
                // Downdetector often blocks server-side requests (403)
                // This is expected behavior - they require browser requests
                if (response.status !== 403) {
                    console.error(`Downdetector fetch failed for ${service}:`, response.status);
                }
                continue;
            }

            const html = await response.text();

            // Parse the status from Downdetector page
            // Look for the status indicator text
            const statusInfo = parseDowndetectorHTML(html, service);
            if (statusInfo) {
                issues.push(statusInfo);
            }
        } catch (error) {
            console.error(`Error fetching Downdetector for ${service}:`, error.message);
        }
    }

    return { issues, error: null };
}

/**
 * Parse Downdetector HTML to extract status information
 */
function parseDowndetectorHTML(html, serviceName) {
    // Look for various indicators of problems
    // Downdetector typically shows "No problems at X" or "Problems at X"

    // Check for "No problems" indicator
    const noProblemsMatch = html.match(/no\s*problems?\s*(at|detected|with)/i);

    // Check for problem indicators
    const problemMatch = html.match(/problems?\s*(at|detected|with)\s*(\w+)/i);

    // Look for report count in the last 24 hours
    const reportCountMatch = html.match(/(\d+)\s*reports?\s*(in\s*the\s*last|today)/i);
    const reportCount = reportCountMatch ? parseInt(reportCountMatch[1]) : 0;

    // Check for outage chart spike - look for baseline comparison
    const hasSpike = html.includes('spike') || html.includes('outage') || reportCount > 100;

    // Determine status
    let status = 'operational';
    let statusText = 'No problems detected';

    if (hasSpike || (problemMatch && !noProblemsMatch)) {
        status = 'issues';
        statusText = `Possible issues reported (${reportCount} reports)`;
    } else if (reportCount > 50) {
        status = 'degraded';
        statusText = `Elevated reports (${reportCount} reports)`;
    }

    // Only return if there are actual issues
    if (status !== 'operational') {
        return {
            title: `${serviceName} - User Reports`,
            description: statusText,
            date: new Date().toISOString(),
            link: `https://downdetector.com/status/${serviceName.toLowerCase().replace(/\s+/g, '-')}/`,
            source: 'Downdetector',
            status: status,
            reportCount: reportCount
        };
    }

    return null;
}

/**
 * Get combined outage status from all sources
 */
async function getOutageStatus(forceRefresh = false) {
    // Check cache
    if (!forceRefresh && outageCache.lastUpdated) {
        const cacheAge = Date.now() - outageCache.lastUpdated;
        if (cacheAge < outageCache.cacheExpiry) {
            return {
                azureStatus: outageCache.azureStatus,
                downdetector: outageCache.downdetector,
                lastUpdated: outageCache.lastUpdated
            };
        }
    }

    // Fetch from both sources in parallel
    const [azureResult, downdetectorResult] = await Promise.all([
        fetchAzureStatus(),
        fetchDowndetectorStatus()
    ]);

    // Update cache
    outageCache.azureStatus = azureResult;
    outageCache.downdetector = downdetectorResult;
    outageCache.lastUpdated = Date.now();

    return {
        azureStatus: azureResult,
        downdetector: downdetectorResult,
        lastUpdated: outageCache.lastUpdated
    };
}

/**
 * Refresh outage data (bypass cache)
 */
async function refreshOutageStatus() {
    return getOutageStatus(true);
}

module.exports = {
    getOutageStatus,
    refreshOutageStatus,
    isRelevantIssue
};

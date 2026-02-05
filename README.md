# Azure Regions Latency Checker

A web application that measures network latency from your browser to all Azure regions worldwide. Built with Node.js and vanilla JavaScript.

![Azure Latency Checker](https://img.shields.io/badge/Azure-Latency%20Checker-0078D4?style=for-the-badge&logo=microsoft-azure)

## Live Demo

**https://azure-latency-checker-anks.azurewebsites.net**

## Features

- **55+ Azure Regions** - Test latency to all public Azure regions globally
- **Real-time Measurement** - Uses browser-based timing to measure actual network latency
- **Visual Indicators** - Color-coded latency results (excellent/good/fair/poor)
- **Filtering** - Filter regions by geography (North America, Europe, Asia Pacific, etc.)
- **Sorting** - Sort by latency, region name, or geography
- **Progress Tracking** - Visual progress bar during testing
- **Fastest Region Detection** - Automatically highlights the lowest latency region
- **Responsive Design** - Works on desktop and mobile devices

## How It Works

The application measures latency by sending HTTP requests to Azure blob storage endpoints in each region and timing the round-trip. It takes the median of multiple measurements to ensure accuracy.

```
Latency Categories:
- Excellent: < 50ms (green)
- Good: 50-100ms (blue)
- Fair: 100-200ms (yellow)
- Poor: > 200ms (red)
```

## Tech Stack

- **Backend:** Node.js + Express
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Hosting:** Azure App Service
- **Latency Testing:** Azure Blob Storage endpoints

## Project Structure

```
azure-latency-checker/
├── package.json        # Dependencies and scripts
├── server.js           # Express server with regions API
├── README.md
└── public/
    ├── index.html      # Main HTML page
    ├── style.css       # Styles and responsive design
    └── app.js          # Latency measurement logic
```

## Local Development

### Prerequisites

- Node.js 18+ installed
- (Optional) Azure CLI for dynamic service availability

### Installation

```bash
# Clone the repository
git clone https://github.com/ankandutta84/azure-latency-checker.git
cd azure-latency-checker

# Install dependencies
npm install

# Start the server
npm start
```

The app will be available at `http://localhost:3000`

### Dynamic Azure Service Availability (Optional)

The app can fetch W365 and AVD region availability directly from Azure APIs instead of using hardcoded data. To enable this:

**Option 1: Azure CLI (for local development)**
```bash
# Login to Azure
az login

# Set your subscription ID
export AZURE_SUBSCRIPTION_ID=your-subscription-id

# Start the server
npm start
```

**Option 2: Service Principal (for production)**
```bash
# Create a service principal with Reader role
az ad sp create-for-rbac --name "azure-latency-checker" --role Reader --scopes /subscriptions/{subscription-id}

# Set environment variables
export AZURE_SUBSCRIPTION_ID=your-subscription-id
export AZURE_TENANT_ID=your-tenant-id
export AZURE_CLIENT_ID=your-client-id
export AZURE_CLIENT_SECRET=your-client-secret

# Start the server
npm start
```

Without Azure configuration, the app uses default/hardcoded service availability data.

## Deployment to Azure

### Using Azure CLI

```bash
# Login to Azure
az login

# Deploy to App Service
az webapp up --name your-app-name --sku B1 --location westus2 --runtime "NODE:20-lts"
```

### Using GitHub Actions

Create `.github/workflows/azure.yml` for CI/CD deployment.

## Azure Regions Covered

| Geography | Regions |
|-----------|---------|
| North America | East US, East US 2, Central US, West US, West US 2, West US 3, Canada Central, Canada East, Mexico Central |
| Europe | North Europe, West Europe, UK South, UK West, France Central, Germany West Central, Switzerland North, Norway East, Sweden Central, Poland Central, Italy North, Spain Central |
| Asia Pacific | East Asia, Southeast Asia, Japan East, Japan West, Korea Central, Central India, South India, Indonesia Central, Malaysia West |
| Australia | Australia East, Australia Southeast, Australia Central, New Zealand North |
| Middle East | UAE North, UAE Central, Qatar Central, Israel Central |
| Africa | South Africa North, South Africa West |
| South America | Brazil South, Brazil Southeast, Chile Central |

## API Endpoints

### GET /api/regions

Returns JSON array of all Azure regions with metadata and service availability:

```json
[
  {
    "name": "East US",
    "code": "eastus",
    "location": "Virginia",
    "geography": "North America",
    "lat": 37.3719,
    "lng": -79.8164,
    "w365": true,
    "avd": true
  }
]
```

### POST /api/refresh-availability

Force refresh service availability data from Azure APIs (requires Azure configuration).

```json
{
  "success": true,
  "w365Count": 27,
  "avdCount": 52
}
```

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

// Major world cities database (no external API needed = zero cost)
const CITIES = [
  // North America
  { name: "New York", country: "USA", lat: 40.7128, lng: -74.006 },
  { name: "Los Angeles", country: "USA", lat: 34.0522, lng: -118.2437 },
  { name: "Chicago", country: "USA", lat: 41.8781, lng: -87.6298 },
  { name: "Houston", country: "USA", lat: 29.7604, lng: -95.3698 },
  { name: "Phoenix", country: "USA", lat: 33.4484, lng: -112.074 },
  { name: "San Francisco", country: "USA", lat: 37.7749, lng: -122.4194 },
  { name: "Seattle", country: "USA", lat: 47.6062, lng: -122.3321 },
  { name: "Denver", country: "USA", lat: 39.7392, lng: -104.9903 },
  { name: "Boston", country: "USA", lat: 42.3601, lng: -71.0589 },
  { name: "Atlanta", country: "USA", lat: 33.749, lng: -84.388 },
  { name: "Miami", country: "USA", lat: 25.7617, lng: -80.1918 },
  { name: "Dallas", country: "USA", lat: 32.7767, lng: -96.797 },
  { name: "Austin", country: "USA", lat: 30.2672, lng: -97.7431 },
  { name: "San Diego", country: "USA", lat: 32.7157, lng: -117.1611 },
  { name: "Portland", country: "USA", lat: 45.5152, lng: -122.6784 },
  { name: "Las Vegas", country: "USA", lat: 36.1699, lng: -115.1398 },
  { name: "Washington DC", country: "USA", lat: 38.9072, lng: -77.0369 },
  { name: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832 },
  { name: "Vancouver", country: "Canada", lat: 49.2827, lng: -123.1207 },
  { name: "Montreal", country: "Canada", lat: 45.5017, lng: -73.5673 },
  { name: "Calgary", country: "Canada", lat: 51.0447, lng: -114.0719 },
  { name: "Mexico City", country: "Mexico", lat: 19.4326, lng: -99.1332 },
  { name: "Guadalajara", country: "Mexico", lat: 20.6597, lng: -103.3496 },

  // Europe
  { name: "London", country: "UK", lat: 51.5074, lng: -0.1278 },
  { name: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
  { name: "Berlin", country: "Germany", lat: 52.52, lng: 13.405 },
  { name: "Munich", country: "Germany", lat: 48.1351, lng: 11.582 },
  { name: "Frankfurt", country: "Germany", lat: 50.1109, lng: 8.6821 },
  { name: "Amsterdam", country: "Netherlands", lat: 52.3676, lng: 4.9041 },
  { name: "Madrid", country: "Spain", lat: 40.4168, lng: -3.7038 },
  { name: "Barcelona", country: "Spain", lat: 41.3851, lng: 2.1734 },
  { name: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964 },
  { name: "Milan", country: "Italy", lat: 45.4642, lng: 9.19 },
  { name: "Dublin", country: "Ireland", lat: 53.3498, lng: -6.2603 },
  { name: "Stockholm", country: "Sweden", lat: 59.3293, lng: 18.0686 },
  { name: "Oslo", country: "Norway", lat: 59.9139, lng: 10.7522 },
  { name: "Copenhagen", country: "Denmark", lat: 55.6761, lng: 12.5683 },
  { name: "Helsinki", country: "Finland", lat: 60.1699, lng: 24.9384 },
  { name: "Warsaw", country: "Poland", lat: 52.2297, lng: 21.0122 },
  { name: "Prague", country: "Czech Republic", lat: 50.0755, lng: 14.4378 },
  { name: "Vienna", country: "Austria", lat: 48.2082, lng: 16.3738 },
  { name: "Zurich", country: "Switzerland", lat: 47.3769, lng: 8.5417 },
  { name: "Geneva", country: "Switzerland", lat: 46.2044, lng: 6.1432 },
  { name: "Brussels", country: "Belgium", lat: 50.8503, lng: 4.3517 },
  { name: "Lisbon", country: "Portugal", lat: 38.7223, lng: -9.1393 },
  { name: "Athens", country: "Greece", lat: 37.9838, lng: 23.7275 },
  { name: "Budapest", country: "Hungary", lat: 47.4979, lng: 19.0402 },
  { name: "Bucharest", country: "Romania", lat: 44.4268, lng: 26.1025 },

  // Asia
  { name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503 },
  { name: "Osaka", country: "Japan", lat: 34.6937, lng: 135.5023 },
  { name: "Seoul", country: "South Korea", lat: 37.5665, lng: 126.978 },
  { name: "Busan", country: "South Korea", lat: 35.1796, lng: 129.0756 },
  { name: "Beijing", country: "China", lat: 39.9042, lng: 116.4074 },
  { name: "Shanghai", country: "China", lat: 31.2304, lng: 121.4737 },
  { name: "Hong Kong", country: "China", lat: 22.3193, lng: 114.1694 },
  { name: "Shenzhen", country: "China", lat: 22.5431, lng: 114.0579 },
  { name: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198 },
  { name: "Bangkok", country: "Thailand", lat: 13.7563, lng: 100.5018 },
  { name: "Kuala Lumpur", country: "Malaysia", lat: 3.139, lng: 101.6869 },
  { name: "Jakarta", country: "Indonesia", lat: -6.2088, lng: 106.8456 },
  { name: "Manila", country: "Philippines", lat: 14.5995, lng: 120.9842 },
  { name: "Ho Chi Minh City", country: "Vietnam", lat: 10.8231, lng: 106.6297 },
  { name: "Hanoi", country: "Vietnam", lat: 21.0278, lng: 105.8342 },
  { name: "Mumbai", country: "India", lat: 19.076, lng: 72.8777 },
  { name: "Delhi", country: "India", lat: 28.6139, lng: 77.209 },
  { name: "Bangalore", country: "India", lat: 12.9716, lng: 77.5946 },
  { name: "Chennai", country: "India", lat: 13.0827, lng: 80.2707 },
  { name: "Hyderabad", country: "India", lat: 17.385, lng: 78.4867 },
  { name: "Kolkata", country: "India", lat: 22.5726, lng: 88.3639 },
  { name: "Pune", country: "India", lat: 18.5204, lng: 73.8567 },
  { name: "Taipei", country: "Taiwan", lat: 25.033, lng: 121.5654 },

  // Middle East
  { name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708 },
  { name: "Abu Dhabi", country: "UAE", lat: 24.4539, lng: 54.3773 },
  { name: "Doha", country: "Qatar", lat: 25.2854, lng: 51.531 },
  { name: "Tel Aviv", country: "Israel", lat: 32.0853, lng: 34.7818 },
  { name: "Riyadh", country: "Saudi Arabia", lat: 24.7136, lng: 46.6753 },
  { name: "Istanbul", country: "Turkey", lat: 41.0082, lng: 28.9784 },
  { name: "Ankara", country: "Turkey", lat: 39.9334, lng: 32.8597 },

  // Africa
  { name: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357 },
  { name: "Lagos", country: "Nigeria", lat: 6.5244, lng: 3.3792 },
  { name: "Johannesburg", country: "South Africa", lat: -26.2041, lng: 28.0473 },
  { name: "Cape Town", country: "South Africa", lat: -33.9249, lng: 18.4241 },
  { name: "Nairobi", country: "Kenya", lat: -1.2921, lng: 36.8219 },
  { name: "Casablanca", country: "Morocco", lat: 33.5731, lng: -7.5898 },

  // Australia & Oceania
  { name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093 },
  { name: "Melbourne", country: "Australia", lat: -37.8136, lng: 144.9631 },
  { name: "Brisbane", country: "Australia", lat: -27.4698, lng: 153.0251 },
  { name: "Perth", country: "Australia", lat: -31.9505, lng: 115.8605 },
  { name: "Auckland", country: "New Zealand", lat: -36.8485, lng: 174.7633 },
  { name: "Wellington", country: "New Zealand", lat: -41.2865, lng: 174.7762 },

  // South America
  { name: "São Paulo", country: "Brazil", lat: -23.5505, lng: -46.6333 },
  { name: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lng: -43.1729 },
  { name: "Buenos Aires", country: "Argentina", lat: -34.6037, lng: -58.3816 },
  { name: "Santiago", country: "Chile", lat: -33.4489, lng: -70.6693 },
  { name: "Lima", country: "Peru", lat: -12.0464, lng: -77.0428 },
  { name: "Bogotá", country: "Colombia", lat: 4.711, lng: -74.0721 },
  { name: "Medellín", country: "Colombia", lat: 6.2476, lng: -75.5658 },
  { name: "Caracas", country: "Venezuela", lat: 10.4806, lng: -66.9036 }
];

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Find nearest Azure regions to a given location
function findNearestRegions(cityLat, cityLng, regions, count = 5) {
  const regionsWithDistance = regions.map(region => ({
    ...region,
    distance: calculateDistance(cityLat, cityLng, region.lat, region.lng)
  }));

  regionsWithDistance.sort((a, b) => a.distance - b.distance);
  return regionsWithDistance.slice(0, count);
}

// Search cities by name (case-insensitive, partial match)
function searchCities(query, limit = 10) {
  if (!query || query.length < 2) return [];

  const lowerQuery = query.toLowerCase();
  const matches = CITIES.filter(city =>
    city.name.toLowerCase().includes(lowerQuery) ||
    city.country.toLowerCase().includes(lowerQuery)
  );

  // Sort by relevance (exact match first, then starts with, then contains)
  matches.sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();

    if (aName === lowerQuery) return -1;
    if (bName === lowerQuery) return 1;
    if (aName.startsWith(lowerQuery) && !bName.startsWith(lowerQuery)) return -1;
    if (bName.startsWith(lowerQuery) && !aName.startsWith(lowerQuery)) return 1;
    return aName.localeCompare(bName);
  });

  return matches.slice(0, limit);
}

// middleware/oneMapAPI.js
const cache = {};

exports.getCoordinates = async (postalCode) => {
  // Return from cache if available.
  if (cache[postalCode]) {
    return cache[postalCode];
  }
  // Updated OneMap API endpoint using the new URL format.
  const url = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${postalCode}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      // Assuming API returns LATITUDE and LONGITUDE as strings.
      const { LATITUDE, LONGITUDE } = data.results[0];
      const coords = { lat: parseFloat(LATITUDE), lon: parseFloat(LONGITUDE) };
      cache[postalCode] = coords;
      console.log("Coordinates for", postalCode, ":", coords);
      return coords;
    }
    return null;
  } catch (err) {
    console.error("Error fetching coordinates:", err);
    return null;
  }
};

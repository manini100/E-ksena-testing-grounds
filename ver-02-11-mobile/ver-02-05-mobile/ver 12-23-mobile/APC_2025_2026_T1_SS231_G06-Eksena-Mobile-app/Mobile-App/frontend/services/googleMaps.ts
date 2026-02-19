import Constants from 'expo-constants';

type Coord = { latitude: number; longitude: number };

function decodePolyline(encoded: string): number[][] {
  const coords: number[][] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    coords.push([lat / 1e5, lng / 1e5]);
  }
  return coords;
}

const apiKey = (Constants.expoConfig as any)?.ios?.config?.googleMaps?.apiKey ||
  (Constants.expoConfig as any)?.android?.config?.googleMaps?.apiKey ||
  (Constants.expoConfig as any)?.extra?.GOOGLE_MAPS_API_KEY ||
  process.env.GOOGLE_MAPS_API_KEY || '';

export const getDirections = async (
  startLng: number,
  startLat: number,
  endLng: number,
  endLat: number
): Promise<Array<{ latitude: number; longitude: number }> | null> => {
  try {
    if (!apiKey) {
      console.warn('[GoogleMaps] No API key available for Directions API');
      return null;
    }

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLat},${startLng}&destination=${endLat},${endLng}&key=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.warn('[GoogleMaps] Directions request failed:', res.status);
      return null;
    }
    const data = await res.json();
    if (!data.routes || data.routes.length === 0) return null;
    const poly = data.routes[0].overview_polyline?.points;
    if (!poly) return null;
    const decoded = decodePolyline(poly);
    return decoded.map((p) => ({ latitude: p[0], longitude: p[1] }));
  } catch (e) {
    console.error('[GoogleMaps] Error fetching directions:', e);
    return null;
  }
};

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, LatLng } from 'react-native-maps';

type Coord = { latitude: number; longitude: number };

async function fetchDirections(origin: Coord, destination: Coord, apiKey: string) {
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Directions request failed');
  const json = await res.json();
  if (json.routes?.length === 0) throw new Error('No route found');
  const points = json.routes[0].overview_polyline?.points;
  if (!points) throw new Error('No polyline');
  return decodePolyline(points).map((p) => ({ latitude: p[0], longitude: p[1] }));
}

// Minimal polyline decoder (no dependency)
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

type Props = {
  origin: Coord;
  destination?: Coord;
  markers?: Array<{ id: string; coord: Coord; title?: string }>; 
  apiKey?: string; // Google Directions API key (optional)
  style?: any;
  zoom?: number;
};

export default function GoogleMap({ origin, destination, markers = [], apiKey, style, zoom = 14 }: Props) {
  const [route, setRoute] = useState<LatLng[] | null>(null);
  const [loading, setLoading] = useState(false);
  const initialRegion = {
    latitude: origin.latitude,
    longitude: origin.longitude,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  };

  useEffect(() => {
    let mounted = true;
    async function loadRoute() {
      if (!destination || !apiKey) return setRoute(null);
      setLoading(true);
      try {
        const pts = await fetchDirections(origin, destination, apiKey);
        if (mounted) setRoute(pts as LatLng[]);
      } catch (e) {
        console.warn('Failed to load directions:', e);
        if (mounted) setRoute(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadRoute();
    return () => { mounted = false; };
  }, [origin, destination, apiKey]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={[{ flex: 1 }, style]}
        initialRegion={initialRegion}
      >
        <Marker coordinate={origin} title="You" />
        {destination && <Marker coordinate={destination} title="Responder" pinColor="blue" />}
        {markers.map((m) => (
          <Marker key={m.id} coordinate={m.coord as LatLng} title={m.title} />
        ))}
        {route && <Polyline coordinates={route} strokeWidth={4} strokeColor="#4285F4" />}
      </MapView>
      {loading && (
        <View style={{ position: 'absolute', top: 10, left: 0, right: 0, alignItems: 'center' }}>
          <ActivityIndicator size="small" color="#000" />
        </View>
      )}
    </View>
  );
}

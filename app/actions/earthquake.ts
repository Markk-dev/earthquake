"use server";

export interface Earthquake {
  id: string;
  magnitude: number;
  place: string;
  time: number;
  updated: number;
  url: string;
  detail: string;
  status: string;
  tsunami: number;
  sig: number;
  net: string;
  code: string;
  ids: string;
  sources: string;
  types: string;
  nst: number | null;
  dmin: number | null;
  rms: number;
  gap: number | null;
  magType: string;
  type: string;
  title: string;
  coordinates: {
    longitude: number;
    latitude: number;
    depth: number;
  };
}

interface USGSFeature {
  type: string;
  properties: {
    mag: number;
    place: string;
    time: number;
    updated: number;
    url: string;
    detail: string;
    status: string;
    tsunami: number;
    sig: number;
    net: string;
    code: string;
    ids: string;
    sources: string;
    types: string;
    nst: number | null;
    dmin: number | null;
    rms: number;
    gap: number | null;
    magType: string;
    type: string;
    title: string;
  };
  geometry: {
    type: string;
    coordinates: [number, number, number]; // [longitude, latitude, depth]
  };
  id: string;
}

interface USGSResponse {
  type: string;
  metadata: {
    generated: number;
    url: string;
    title: string;
    status: number;
    api: string;
    count: number;
  };
  features: USGSFeature[];
}

// Philippines bounding box
const PHILIPPINES_BOUNDS = {
  minLat: 4.5,
  maxLat: 21.0,
  minLon: 116.0,
  maxLon: 127.0,
};

function isInPhilippines(longitude: number, latitude: number): boolean {
  return (
    latitude >= PHILIPPINES_BOUNDS.minLat &&
    latitude <= PHILIPPINES_BOUNDS.maxLat &&
    longitude >= PHILIPPINES_BOUNDS.minLon &&
    longitude <= PHILIPPINES_BOUNDS.maxLon
  );
}

export async function getEarthquakes(): Promise<Earthquake[]> {
  try {
    // Fetch last 24 hours of earthquakes
    const response = await fetch(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
      {
        next: { revalidate: 60 }, // Revalidate every 60 seconds for real-time updates
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch earthquake data");
    }

    const data: USGSResponse = await response.json();

    // Filter earthquakes in Philippines region and transform to our format
    const earthquakes: Earthquake[] = data.features
      .filter((feature) => {
        const [longitude, latitude] = feature.geometry.coordinates;
        return isInPhilippines(longitude, latitude);
      })
      .map((feature) => {
        const [longitude, latitude, depth] = feature.geometry.coordinates;
        return {
          id: feature.id,
          magnitude: feature.properties.mag,
          place: feature.properties.place,
          time: feature.properties.time,
          updated: feature.properties.updated,
          url: feature.properties.url,
          detail: feature.properties.detail,
          status: feature.properties.status,
          tsunami: feature.properties.tsunami,
          sig: feature.properties.sig,
          net: feature.properties.net,
          code: feature.properties.code,
          ids: feature.properties.ids,
          sources: feature.properties.sources,
          types: feature.properties.types,
          nst: feature.properties.nst,
          dmin: feature.properties.dmin,
          rms: feature.properties.rms,
          gap: feature.properties.gap,
          magType: feature.properties.magType,
          type: feature.properties.type,
          title: feature.properties.title,
          coordinates: {
            longitude,
            latitude,
            depth,
          },
        };
      })
      .sort((a, b) => b.time - a.time); // Sort by most recent first

    return earthquakes;
  } catch (error) {
    console.error("Error fetching earthquakes:", error);
    return [];
  }
}


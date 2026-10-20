export type Coordinates = {
  latitude: number;
  longitude: number;
};

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Distance à vol d'oiseau entre deux points, en kilomètres (formule de haversine).
 * La Terre est assimilée à une sphère : l'erreur reste sous 0,5 %, largement suffisant ici.
 */
export function distanceKm(from: Coordinates, to: Coordinates): number {
  const deltaLat = toRadians(to.latitude - from.latitude);
  const deltaLon = toRadians(to.longitude - from.longitude);

  // a : carré de la demi-corde entre les deux points ; c : angle au centre de la Terre, en radians.
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) * Math.cos(toRadians(to.latitude)) * Math.sin(deltaLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

const ONE_DECIMAL = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });
const NO_DECIMAL = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

/** 0,35 -> "350 m" ; 3,24 -> "3,2 km" ; 42,7 -> "43 km". */
export function formatDistance(km: number): string {
  if (km < 1) return `${NO_DECIMAL.format(km * 1000)} m`;
  if (km < 10) return `${ONE_DECIMAL.format(km)} km`;
  return `${NO_DECIMAL.format(km)} km`;
}

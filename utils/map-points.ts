import type { SelectLocation } from "~/lib/db/schema";
import type { MapPoint } from "~/lib/types";

export function createMapPointFromLocation(location: SelectLocation): MapPoint {
  return {
    ...location,
    to: { name: "dashboard-location-slug", params: { slug: location.slug } },
    toLabel: "View",
  };
}

export function isPointSelected(
  item: Pick<MapPoint, "id" | "longitude" | "latitude"> | null | undefined,
  selectedPoint: MapPoint | null | undefined,
) {
  if (!item || !selectedPoint)
    return false;
  return (
    item.id === selectedPoint.id
    && item.latitude === selectedPoint.latitude
    && item.longitude === selectedPoint.longitude
  );
}

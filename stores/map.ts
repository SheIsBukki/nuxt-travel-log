import type { LngLatBounds } from "maplibre-gl";

import type { MapPoint } from "~/lib/types";

export const useMapStore = defineStore("useMapStore", () => {
  const mapPoints = ref<MapPoint[]>([]);
  const selectedPoint = ref<MapPoint | null>(null);
  const shouldFlyTo = ref(true);

  function selectPointWithoutFlyTo(point: MapPoint | null) {
    shouldFlyTo.value = false;
    selectedPoint.value = point;
  }

  // Dynamically initialise maplibre-gl and vue-maplibre-gl, and this init function will only get called on the client-side inside of the map component——map.client.vue
  async function init() {
    const { useMap } = await import("@indoorequal/vue-maplibre-gl");
    const { LngLatBounds } = await import("maplibre-gl");

    // Sice there's only one map in the project, we can just call it map and don't to create and use a map-key
    const map = useMap();

    let bounds: LngLatBounds | null = null;
    const padding = 60;

    effect(() => {
      const firstPoint = mapPoints.value[0];
      if (!firstPoint) {
        return;
      }

      bounds = mapPoints.value.reduce((bounds, point) => {
        return bounds.extend([point.longitude, point.latitude]);
      }, new LngLatBounds(
        [firstPoint.longitude, firstPoint.latitude],
        [firstPoint.longitude, firstPoint.latitude],
      ));

      map.map?.fitBounds(bounds, { padding });
    });

    effect(() => {
      if (selectedPoint.value) {
        if (shouldFlyTo.value) {
          map.map?.flyTo({
            center: [selectedPoint.value.longitude, selectedPoint.value.latitude],
            // zoom: 3,
            speed: 0.5,
          });
        }

        shouldFlyTo.value = true;
      }
      else if (bounds) {
        map.map?.fitBounds(bounds, { padding });
      }
    });
  }

  return { init, mapPoints, selectedPoint, selectPointWithoutFlyTo };
});

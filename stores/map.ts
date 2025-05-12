import type { LngLatBounds } from "maplibre-gl";

import type { MapPoint } from "~/lib/types";

export const useMapStore = defineStore("useMapStore", () => {
  const mapPoints = ref<MapPoint[]>([]);
  const selectedPoint = ref<MapPoint | null>(null);
  const addedPoint = ref<MapPoint & { centreMap?: boolean } | null>(null);

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

      map.map?.fitBounds(bounds, { padding, maxZoom: 10 });
    });

    watch(addedPoint, (newValue, oldValue) => {
      if ((newValue && !oldValue) || newValue?.centreMap) {
        map.map?.flyTo({
          center: [newValue.longitude, newValue.latitude],
          speed: 0.8,
          zoom: 6,
        });
      }
    }, { immediate: true });
  }

  return { init, addedPoint, mapPoints, selectedPoint };
});

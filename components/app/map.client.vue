<script setup lang="ts">
import type { MglEvent } from "@indoorequal/vue-maplibre-gl";
import type { LngLat } from "maplibre-gl";

import { CENTRE_NIGERIA } from "~/lib/constants";

const mapStore = useMapStore();

const colorMode = useColorMode();
// const style = "https://tiles.openfreemap.org/styles/liberty";
// const style = "/styles/dark.json";
const style = computed(() => colorMode.value === "dark" ? "/styles/dark.json" : "https://tiles.openfreemap.org/styles/liberty");
// const center = [-1.559482, 47.21322];
const zoom = 5;

function updateAddedPoint(location: LngLat) {
  if (mapStore.addedPoint) {
    mapStore.addedPoint.latitude = location.lat;
    mapStore.addedPoint.longitude = location.lng;
  }
}

function onDoubleClick(mglEvent: MglEvent<"dblclick">) {
  if (mapStore.addedPoint) {
    mapStore.addedPoint.latitude = mglEvent.event.lngLat.lat;
    mapStore.addedPoint.longitude = mglEvent.event.lngLat.lng;
  }
}

onMounted(() => {
  mapStore.init();
});
</script>

<template>
  <MglMap
    :map-style="style"
    :center="CENTRE_NIGERIA"
    :zoom="zoom"
    @map:dblclick="onDoubleClick"
  >
    <MglNavigationControl />

    <MglMarker
      v-if="mapStore.addedPoint"
      draggable
      :coordinates="[mapStore.addedPoint.longitude, mapStore.addedPoint.latitude]"
      @update:coordinates="updateAddedPoint"
    >
      <template #marker>
        <div
          class="tooltip tooltip-open hover:cursor-pointer"
          data-tip="Drag to your desired location"
        >
          <Icon
            name="tabler:map-pin-filled"
            size="35"
            class="text-warning"
          />
        </div>
      </template>
    </MglMarker>

    <MglMarker
      v-for="point in mapStore.mapPoints"
      :key="point.id"
      :coordinates="[point.longitude, point.latitude]"
    >
      <template #marker>
        <div
          :data-tip="point.name"
          class="tooltip tooltip-top hover:cursor-pointer"
          :class="{ 'tooltip-open': mapStore.selectedPoint === point }"
          @mouseenter="mapStore.selectedPoint = point"
          @mouseleave="mapStore.selectedPoint = null"
        >
          <Icon
            name="tabler:map-pin-filled"
            size="30"
            :class="mapStore.selectedPoint === point ? 'text-accent' : 'text-secondary'"
          />
        </div>
      </template>

      <MglPopup class="">
        <h3 class="text-xl">
          {{ point.name }}
        </h3>
        <p v-if="point.description">
          {{ point.description }}
        </p>
      </MglPopup>
    </MglMarker>
  </MglMap>
</template>

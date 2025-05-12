<script setup lang="ts">
import type { MglEvent } from "@indoorequal/vue-maplibre-gl";
import type { LngLat } from "maplibre-gl";

import { CENTRE_NIGERIA } from "~/lib/constants";
import { isPointSelected } from "~/utils/map-points";

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
      class-name="z-50"
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
          :class="{ 'tooltip-open': isPointSelected(point, mapStore.selectedPoint) }"
          @mouseenter="mapStore.selectedPoint = point"
          @mouseleave="mapStore.selectedPoint = null"
        >
          <Icon
            name="tabler:map-pin-filled"
            size="30"
            :class="isPointSelected(point, mapStore.selectedPoint) ? 'text-accent' : 'text-secondary'"
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

        <!-- Option to go to the dedication page of a location -->
        <div class="flex mt-4">
          <NuxtLink
            v-if="point.to"
            :to="point.to"
            class="btn btn-sm btn-outline"
          >
            {{ point.toLabel }}
          </NuxtLink>
        </div>
      </MglPopup>
    </MglMarker>
  </MglMap>
</template>

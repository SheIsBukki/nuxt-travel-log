<script setup lang="ts">
import { CENTRE_NIGERIA } from "~/lib/constants";

const colorMode = useColorMode();
// const style = "https://tiles.openfreemap.org/styles/liberty";
// const style = "/styles/dark.json";
const style = computed(() => colorMode.value === "dark" ? "/styles/dark.json" : "https://tiles.openfreemap.org/styles/liberty");
// const center = [-1.559482, 47.21322];
const zoom = 5;

const mapStore = useMapStore();

onMounted(() => {
  mapStore.init();
});
</script>

<template>
  <MglMap
    :map-style="style"
    :center="CENTRE_NIGERIA"
    :zoom="zoom"
  >
    <MglNavigationControl />
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
          @mouseenter="mapStore.selectPointWithoutFlyTo(point)"
          @mouseleave="mapStore.selectPointWithoutFlyTo(null)"
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

<script setup lang="ts">
import { CENTER_NIGERIA } from "~/lib/constants";

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
    :center="CENTER_NIGERIA"
    :zoom="zoom"
  >
    <MglNavigationControl />
    <MglMarker
      v-for="point in mapStore.mapPoints"
      :key="point.id"
      :coordinates="[point.longitude, point.latitude]"
    >
      <template #marker>
        <div class="tooltip tooltip-top">
          <div class="tooltip-content">
            <div class="animate-bounce text-2xl">
              {{ point.label }}
            </div>
          </div>
          <Icon
            name="tabler:map-pin-filled"
            size="30"
            class="text-secondary"
          />
        </div>
      </template>
    </MglMarker>
  </MglMap>
</template>

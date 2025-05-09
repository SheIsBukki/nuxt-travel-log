<script setup lang="ts">
import { CENTER_NIGERIA } from "~/lib/constants";

const colorMode = useColorMode();
// const style = "https://tiles.openfreemap.org/styles/liberty";
// const style = "/styles/dark.json";
const style = computed(() => colorMode.value === "dark" ? "/styles/dark.json" : "https://tiles.openfreemap.org/styles/liberty");
// const center = [-1.559482, 47.21322];
const zoom = 5;
</script>

<template>
  <MglMap
    :map-style="style"
    :center="CENTER_NIGERIA"
    :zoom="zoom"
  >
    <MglNavigationControl />
  </MglMap>
</template>

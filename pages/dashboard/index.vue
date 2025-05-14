<script lang="ts" setup>
import LocationCard from "~/components/location-card.vue";
import { createMapPointFromLocation } from "~/utils/map-points";

const locationsStore = useLocationStore();
const { locations, locationStatus: status } = storeToRefs(locationsStore);

onMounted(() => {
  locationsStore.refreshLocations();
});
</script>

<template>
  <div class="page-content-top">
    <h2 class="text-2xl">
      Locations
    </h2>

    <div v-if="status === 'pending'" class="">
      <span class="loading loading-spinner loading-xl text-primary" />
    </div>

    <div
      v-else-if="locations && locations.length > 0"
      class="location-list"
    >
      <LocationCard
        v-for="location in locations"
        :key="location.id"
        :map-point="createMapPointFromLocation(location)"
      />
    </div>

    <div v-else class="flex flex-col gap-2 mt-4">
      <p class="">
        Add a location to get started
      </p>

      <NuxtLink to="/dashboard/add" class="btn w-40 btn-primary">
        Add Location
        <Icon name="tabler:circle-filled-plus" size="24" />
      </NuxtLink>
    </div>
  </div>
</template>

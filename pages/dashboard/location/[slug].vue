<script setup lang="ts">
const route = useRoute();
const locationStore = useLocationStore();

const {
  currentLocation: location,
  currentLocationStatus: status,
  currentLocationError: error,
} = storeToRefs(locationStore);

onMounted(() => locationStore.refreshCurrentLocation());

onBeforeRouteUpdate((to) => {
  if (to.name === "dashboard-location-slug") {
    locationStore.refreshCurrentLocation();
  }
});
</script>

<template>
  <div class="p-4 min-h-64">
    <div v-if="status === 'pending'" class="">
      <div class="loading" />
    </div>

    <div v-if="error && status !== 'pending'" class="alert alert-error">
      <h2 class="text-lg">
        {{ error.statusMessage }}
      </h2>
    </div>

    <div
      v-if="
        route.name === 'dashboard-location-slug'
          && location
          && status !== 'pending'
      "
      class=""
    >
      <h2 class="text-xl">
        {{ location.name }}
      </h2>
      <p class="text-sm">
        {{ location.description }}
      </p>

      <!-- If the user doesn't have location logs -->
      <div v-if="!location.locationLogs.length" class="mt-4">
        <p class="text-sm italic">
          Add a location log to get started
        </p>
      </div>
      <button class="btn btn-primary mt-2">
        Add Location Log
        <Icon name="tabler:map-pin-plus" size="24" />
      </button>
    </div>

    <div v-if="route.name !== 'dashboard-location-slug'" class="">
      <NuxtPage />
    </div>
  </div>
</template>

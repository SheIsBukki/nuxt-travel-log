<script setup lang="ts">
const locationStore = useLocationStore();

const { currentLocation: location, currentLocationStatus: status, currentLocationError: error } = storeToRefs(locationStore);

onMounted(() => locationStore.refreshCurrentLocation());
</script>

<template>
  <div class="p-4 min-h-64">
    <div v-if="status === 'pending'" class="">
      <div class="loading" />
    </div>

    <div v-if="location && status !== 'pending'" class="">
      <h2 class="text-xl">
        {{ location.name }}
      </h2>
      <p class="text-sm">
        {{ location.description }}
      </p>

      <!-- If the user doesn't have location logs -->
      <div v-if="!location.locationLogs.length" class="mt-4">
        <p class="text-sm italic ">
          Add a location log to get started
        </p>
        <button class="btn btn-primary mt-2">
          Add Location Log
          <Icon name="tabler:map-pin-plus" size="24" />
        </button>
      </div>
    </div>

    <div v-if="error && status !== 'pending'" class="alert alert-error">
      <h2 class="text-lg">
        {{ error.statusMessage }}
      </h2>
    </div>
  </div>
</template>

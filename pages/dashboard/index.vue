<script lang="ts" setup>
const locationsStore = useLocationStore();
const { locations, status } = storeToRefs(locationsStore);

const mapStore = useMapStore();

onMounted(() => {
  locationsStore.refresh();
});
</script>

<template>
  <div class="p-4">
    <h2 class="text-2xl">
      Locations
    </h2>

    <div v-if="status === 'pending'" class="">
      <span class="loading loading-spinner loading-xl text-primary" />
    </div>

    <div v-else-if="locations && locations.length > 0" class="flex flex-nowrap mt-4 gap-2 overflow-auto">
      <div
        v-for="location in locations"
        :key="location.id"
        class="card card-compact bg-base-300 h-40 border-1 w-72 shrink-0 hover:cursor-pointer mb-4"
        :class="{ 'border-accent': location === mapStore.selectedPoint, 'border-transparent': location !== mapStore.selectedPoint }"

        @mouseenter="mapStore.selectedPoint = location"
        @mouseleave="mapStore.selectedPoint = null"
      >
        <div class="card-body">
          <h3 class="text-xl">
            {{ location.name }}
          </h3>
          <p class="card-text">
            {{ location.description }}
          </p>
        </div>
      </div>
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

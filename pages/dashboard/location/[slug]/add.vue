<script setup lang="ts">
import type { InsertLocationLog } from "~/lib/db/schema";

import { CENTRE_NIGERIA } from "~/lib/constants";

const { $csrfFetch } = useNuxtApp();
const route = useRoute();
const { currentLocation } = useLocationStore();

async function onSubmit(values: InsertLocationLog) {
  await $csrfFetch(`/api/locations/${route.params.slug}/add`, {
    method: "post",
    body: values,
  });
}

async function submitComplete() {
  navigateTo({
    name: "dashboard-location-slug",
    params: { slug: route.params.slug },
  });
}
</script>

<template>
  <LocationLogForm
    submit-icon="tabler:map-plus"
    submit-label="Add Location Log"
    :on-submit="onSubmit"
    :on-submit-complete="submitComplete"
    :initial-values="{
      name: '',
      description: '',
      startedAt: Date.now() - 24 * 60 * 60 * 1000,
      endedAt: Date.now() - 24 * 60 * 60 * 1000,
      latitude:
        currentLocation?.latitude || (CENTRE_NIGERIA as [number, number])[1],
      longitude:
        currentLocation?.longitude || (CENTRE_NIGERIA as [number, number])[0],
    }"
  />
</template>

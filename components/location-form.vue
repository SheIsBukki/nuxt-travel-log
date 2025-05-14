<script setup lang="ts">
import { CENTRE_NIGERIA } from "~/lib/constants";
import { InsertLocation } from "~/lib/db/schema";

const props = defineProps<{
  initialValues?: InsertLocation;
  onSubmit: (Location: InsertLocation) => Promise<any>;
  onSubmitComplete: () => void;
  submitLabel: string;
  submitIcon: string;
  zoom?: number;
}>();
</script>

<template>
  <LocationBaseForm
    v-slot="{ errors, loading }"
    :zoom="props.zoom || 6"
    :schema="InsertLocation"
    :initial-values="props.initialValues || {
      name: '',
      description: '',
      latitude: (CENTRE_NIGERIA as [number, number])[1],
      longitude: (CENTRE_NIGERIA as [number, number])[0],
    }"

    :on-submit
    :on-submit-complete
    :submit-label
    :submit-icon
  >
    <AppFormField
      :disabled="loading"
      name="name"
      label="Name"
      :error="errors.name"
    />

    <AppFormField
      :disabled="loading"
      name="description"
      type="textarea"
      label="Description"
      :error="errors.description"
    />
  </LocationBaseForm>
</template>

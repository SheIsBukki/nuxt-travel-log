<script setup lang="ts">
import type { FetchError } from "ofetch";

import { toTypedSchema } from "@vee-validate/zod";

import type { NominatimResults } from "~/lib/types";

import AddMessagingList from "~/components/add-messaging-list.vue";
import { CENTRE_NIGERIA } from "~/lib/constants";
import { InsertLocation } from "~/lib/db/schema";

const props = defineProps<{
  initialValues?: InsertLocation | null;
  onSubmit: (Location: InsertLocation) => Promise<any>;
  onSubmitComplete: () => void;
  submitLabel: string;
  submitIcon: string;
}>();

const router = useRouter();
const mapStore = useMapStore();
const loading = ref(false);
const submitted = ref(false);
const submitError = ref("");

const { handleSubmit, errors, meta, setErrors, setFieldValue, controlledValues } = useForm({
  validationSchema: toTypedSchema(InsertLocation),
  initialValues: {
    name: props.initialValues?.name || "",
    description: props.initialValues?.description || "",
    latitude: props.initialValues?.latitude || (CENTRE_NIGERIA as [number, number])[1],
    longitude: props.initialValues?.longitude || (CENTRE_NIGERIA as [number, number])[0],
  },
});

const onSubmit = handleSubmit(async (values: InsertLocation) => {
  try {
    submitError.value = "";
    loading.value = true;
    await props.onSubmit(values);
    submitted.value = true;
    props.onSubmitComplete();
  }
  catch (e) {
    const error = e as FetchError;
    if (error.data?.data) {
      setErrors(error.data?.data);
    }

    submitError.value = getFetchErrorMessage(error);
  }

  loading.value = false;
});

function formatNumber(value?: number) {
  if (!value)
    return 0;
  return value.toFixed(5);
}

function searchResultSelected(result: NominatimResults) {
  setFieldValue("name", result.display_name);
  mapStore.addedPoint = {
    id: 1,
    name: "Added Point",
    description: "",
    latitude: Number(result.lat),
    longitude: Number(result.lon),
    centreMap: true,
  };
}

effect(() => {
  if (mapStore.addedPoint) {
    setFieldValue("longitude", mapStore.addedPoint.longitude);
    setFieldValue("latitude", mapStore.addedPoint.latitude);
  }
});

onMounted(() => {
  mapStore.addedPoint = {
    id: 1,
    name: "Added Point",
    description: "",
    latitude: props.initialValues?.latitude || (CENTRE_NIGERIA as [number, number])[1],
    longitude: props.initialValues?.longitude || (CENTRE_NIGERIA as [number, number])[0],
  };
});

onBeforeRouteLeave(() => {
  if (!submitted.value && meta.value.dirty) {
    // eslint-disable-next-line no-alert
    const confirm = window.confirm("Are you sure you want to leave? All unsaved changes will be lost");

    if (!confirm) {
      return false;
    }
  }

  mapStore.addedPoint = null;
  return true;
});
</script>

<template>
  <div
    v-if="submitError"
    role="alert"
    class="alert alert-error"
  >
    <span>{{ submitError }}</span>
  </div>

  <form
    class="flex flex-col gap-2"
    @submit.prevent="onSubmit"
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

    <!-- Coordinates of the current location on the map -->
    <p class="text-xs text-gray-400">
      Current coordinates: {{ formatNumber(controlledValues.latitude) }}, {{ formatNumber(controlledValues.longitude) }}
    </p>

    <!-- Submit and cancel buttons -->
    <div class="flex justify-end gap-2">
      <!-- Cancel button -->
      <button
        :disabled="loading"
        type="button"
        class="btn btn-outline"
        @click="router.back()"
      >
        <icon name="tabler:arrow-left" size="24" />
        Cancel
      </button>

      <!-- Submit button -->
      <button
        :disabled="loading"
        type="submit"
        class="btn btn-primary"
      >
        {{ props.submitLabel }}
        <span v-if="loading" class="loading loading-spinner loading-xs text-primary" />
        <icon
          v-else
          :name="props.submitIcon"
          size="24"
        />
      </button>
    </div>

    <!-- My preferred spot to place the how-to-add coordinates messaging -->
    <div class="divider" />
    <div class="mt-[-18px]">
      <p class="mb-1">
        To set the coordinates:
      </p>
      <ul class="text-sm">
        <AddMessagingList
          :has-inner-icon="true"
          text="Drag the"
          text-after-icon="marker on the map"
        />
        <AddMessagingList text="Double click on the map" />
        <AddMessagingList text="Or search for a location below" />
      </ul>
    </div>
  </form>

  <AppPlaceSearch @result-selected="searchResultSelected" />
</template>

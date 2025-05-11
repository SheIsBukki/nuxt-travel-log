<script setup lang="ts">
import type { FetchError } from "ofetch";

import { toTypedSchema } from "@vee-validate/zod";

import type { NominatimResults } from "~/lib/types";

import AddMessagingList from "~/components/add-messaging-list.vue";
import { CENTRE_NIGERIA } from "~/lib/constants";
import { InsertLocation } from "~/lib/db/schema";

const { $csrfFetch } = useNuxtApp();
const router = useRouter();
const mapStore = useMapStore();
const loading = ref(false);
const submitted = ref(false);
const submitError = ref("");

const { handleSubmit, errors, meta, setErrors, setFieldValue, controlledValues } = useForm({
  validationSchema: toTypedSchema(InsertLocation),
  initialValues: {
    name: "",
    description: "",
    latitude: (CENTRE_NIGERIA as [number, number])[0],
    longitude: (CENTRE_NIGERIA as [number, number])[1],
  },
});

const onSubmit = handleSubmit(async (values) => {
  try {
    submitError.value = "";

    loading.value = true;

    await $csrfFetch("/api/locations", {
      method: "post",
      body: values,
    });

    submitted.value = true;

    navigateTo("/dashboard");
  }
  catch (e) {
    const error = e as FetchError;
    if (error.data.data) {
      setErrors(error.data.data);
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

const addMessaging = ["Drag the", "marker on the map", "Double click on the map", "Or search for a location below"];

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
    latitude: (CENTRE_NIGERIA as [number, number])[0],
    longitude: (CENTRE_NIGERIA as [number, number])[1],
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
  <div class="container max-w-md mx-auto p-4">
    <div class="my-4">
      <h1 class="text-lg">
        Add Location
      </h1>
      <p class="text-sm">
        A location is a place you have traveled to or will travel to. It can be
        a city, country, state or place of interest. You can add specific times
        you visited this location after adding it.
      </p>
    </div>

    <div
      v-if="submitError"
      role="alert"
      class="alert alert-error"
    >
      <span>{{ submitError }}</span>
    </div>

    <form
      action=""
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
          Add
          <span v-if="loading" class="loading loading-spinner loading-xs text-primary" />
          <icon
            v-else
            name="tabler:circle-plus-filled"
            size="24"
          />
        </button>
      </div>

      <div class="divider" />
      <!-- Messaging telling the user how to find a location on the map -->
      <div class="mt-[-18px]">
        <p class="mb-1">
          To set the coordinates:
        </p>

        <ul class="text-sm">
          <AddMessagingList
            :has-inner-icon="true"
            :text="addMessaging[0]"
            :additional-text="addMessaging[1]"
          />
          <div
            v-for="text, index in addMessaging.slice(2)"
            :key="index"
          >
            <AddMessagingList :text="text" />
          </div>
        </ul>
      </div>
    </form>
    <AppPlaceSearch @result-selected="searchResultSelected" />
  </div>
</template>

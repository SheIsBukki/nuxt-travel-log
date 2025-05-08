<script setup lang="ts">
import type { FetchError } from "ofetch";

import { toTypedSchema } from "@vee-validate/zod";

import { InsertLocation } from "~/lib/db/schema";

const { $csrfFetch } = useNuxtApp();

const router = useRouter();

const loading = ref(false);

const submitted = ref(false);

const submitError = ref("");

const { handleSubmit, errors, meta, setErrors } = useForm({
  validationSchema: toTypedSchema(InsertLocation),
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

    submitError.value = error.data?.statusMessage || error.statusMessage || "An unknown error occurred";
  }

  loading.value = false;
});

onBeforeRouteLeave(() => {
  if (!submitted.value && meta.value.dirty) {
    // eslint-disable-next-line no-alert
    const confirm = window.confirm("Are you sure you want to leave? All unsaved changes will be lost");
    if (!confirm) {
      return false;
    }
  }
  return true;
});
</script>

<template>
  <div class="container max-w-md mx-auto">
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

      <!-- Latitude -->
      <fieldset class="fieldset">
        <legend class="fieldset-legend">
          Latitude
        </legend>

        <Field
          :disabled="loading"
          name="latitude"
          type="number"
          class="input w-full"
          :class="{ 'input-error': errors.latitude }"
        />
        <p v-if="errors.latitude" class="label text-error">
          {{ errors.latitude }}
        </p>
      </fieldset>

      <!-- Longitude -->
      <fieldset class="fieldset">
        <legend class="fieldset-legend">
          Longitude
        </legend>

        <Field
          :disabled="loading"
          name="longitude"
          type="number"
          class="input w-full"
          :class="{ 'input-error': errors.longitude }"
        />
        <p v-if="errors.longitude" class="label text-error">
          {{ errors.longitude }}
        </p>
      </fieldset>

      <!--      These two work but complain because of the type conflict from the props... -->
      <!-- <AppFormField
        :disabled="loading"
        name="latitude"
        label="Latitude"
        :error="errors.latitude"
      /> -->

      <!-- <AppFormField
        :disabled="loading"
        name="longitude"
        label="Longitude"
        :error="errors.longitude"
      /> -->

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
    </form>
  </div>
</template>

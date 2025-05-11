<script setup lang="ts">
import type { FetchError } from "ofetch";

import type { NominatimResults } from "~/lib/types";

import { SearchSchema } from "~/lib/zod-schemas";

const emit = defineEmits<{
  resultSelected: [result: NominatimResults];
}>();

const searchResults = ref<NominatimResults[]>([]);
const form = useTemplateRef("form");
const loading = ref(false);
const hasSearched = ref(false);
const errorMessage = ref("");

async function onSubmit(query: Record<string, string>) {
  try {
    loading.value = true;
    hasSearched.value = true;
    errorMessage.value = "";
    searchResults.value = [];
    const results = await $fetch("/api/search", { query });

    searchResults.value = results;
  }
  catch (e) {
    const error = e as FetchError;
    errorMessage.value = getFetchErrorMessage(error);
  }

  loading.value = false;
}

function setLocation(result: NominatimResults) {
  emit("resultSelected", result);
  searchResults.value = [];
  errorMessage.value = "";
  hasSearched.value = false;

  if (form.value) {
    form.value.resetForm();
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <Form
      ref="form"
      v-slot="{ errors }"
      class="flex flex-col gap-2 items-center"
      :validation-schema="toTypedSchema(SearchSchema)"
      :initial-values="{ q: '' }"
      @submit="onSubmit"
    >
      <div class="join mt-4">
        <div class="">
          <label class="input join-item">
            <Icon
              name="tabler:search"
              size="18"
              class="h-[1em] opacity-50"
            />
            <Field
              name="q"
              type="text"
              placeholder="Search for a location.."
              :class="{ 'input-error': errors.q }"
              :disabled="loading"
            /></label>

          <div v-if="errors.q" class="validator text-error">
            {{ errors.q }}
          </div>
        </div>

        <button :disabled="loading" class="btn btn-neutral join-item">
          Search
        </button>
      </div>
    </Form>

    <!-- Search error -->
    <div
      v-if="!loading && errorMessage"
      role="alert"
      class="alert alert-error mt-2"
    >
      {{ errorMessage }}
    </div>
    <div
      v-if="!loading && hasSearched && !searchResults.length"
      role="alert"
      class="alert alert-warning mt-2"
    >
      No results found
    </div>

    <!-- Search result Skeleton -->
    <div v-if="loading" class="flex justify-center">
      <div class="loading loading-lg" />
    </div>

    <!-- Search Results -->
    <div v-else class="flex flex-col overflow-auto gap-2 max-h-60 mt-2">
      <div
        v-for="result in searchResults"
        :key="result.place_id"
        class="card-xs bg-base-100"
      >
        <div class="card-body">
          <h4 class="card-title">
            {{ result.display_name }}
          </h4>

          <div class="justify-end card-actions">
            <button
              class="btn btn-sm btn-soft"
              @click="setLocation(result)"
            >
              Choose location
              <Icon
                name="tabler:map-pin-plus"
                size="18"
                class="text-warning"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- tabler:map-pin-check -->

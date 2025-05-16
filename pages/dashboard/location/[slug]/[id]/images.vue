<script setup lang="ts">
import { FetchError } from "ofetch";

const route = useRoute();

const locationStore = useLocationStore();
const {
  currentLocationLog: locationLog,
} = storeToRefs(locationStore);

const { $csrfFetch } = useNuxtApp();

const image = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const loading = ref(false);
const errorMessage = ref("");
const imageInput = useTemplateRef("imageInput");

function selectImage(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];

  if (file) {
    image.value = file;
    previewUrl.value = URL.createObjectURL(file);
  }
}

async function getChecksum(blob: Blob) {
  const arrayBuffer = await blob.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);

  return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
}

async function uploadImage() {
  if (!image.value || !previewUrl.value)
    return;

  loading.value = true;
  errorMessage.value = "";
  const previewImage = new Image();

  previewImage.addEventListener("load", async () => {
    /**
     * Accoridng to the instructor, if you specify either width or height, the other dimension automatically resizes to match the specified one. So, no need to define the resizing for both width and height
     */
    const width = Math.min(1000, previewImage.width);
    const resized = await createImageBitmap(previewImage, {
      resizeWidth: width,
    });

    /**
     * Converts the image to a JPEG image. In order to convert and optimse the image, we will draw it on a canvas
     */
    const canvas = new OffscreenCanvas(width, resized.height);
    canvas.getContext("bitmaprenderer")?.transferFromImageBitmap(resized);
    const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.9 });

    const checksum = await getChecksum(blob);

    try {
      const { fields, key, url } = await $csrfFetch(`/api/locations/${route.params.slug}/${route.params.id}/sign-image`, {
        method: "POST",
        body: { checksum, contentLength: blob.size },
      });

      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      formData.append("file", blob);

      await $fetch(url, { method: "POST", body: formData, headers: { "x-amz-checksum-algorithm": "SHA256" } });

      await $csrfFetch(`/api/locations/${route.params.slug}/${route.params.id}/image`, {
        method: "POST",
        body: { key },
      });

      await locationStore.refreshCurrentLocationLog();
      image.value = null;
      previewUrl.value = null;
      if (imageInput.value) {
        imageInput.value.value = "";
      }
    }
    catch (e) {
      if (e instanceof FetchError) {
        errorMessage.value = (e as FetchError).statusMessage || "Unknow Error";
      }
      else if (e instanceof Error) {
        errorMessage.value = (e as Error).message;
      }
      else {
        errorMessage.value = "Unknown Error";
      }
    }

    loading.value = false;
  });
  previewImage.src = previewUrl.value;
}
</script>

<template>
  <div class="">
    <h2 class="mb-2">
      Manage "{{ locationLog?.name || "Log" }}" Images
    </h2>

    <div class="flex flex-row">
      <div class="flex gap-2 flex-col w-72">
        <div class="relative bg-gray-500 h-28 w-full flex justify-center items-center p-1">
          <p v-if="!previewUrl" class="text-center text-white">
            Select an image
          </p>

          <img
            v-else
            :src="previewUrl"
            alt="image preview"
            class="h-full object-cover"
          >
          <div v-if="loading || errorMessage" class=" size-full absolute flex justify-center items-center bg-black opacity-50">
            <div v-if="loading" class="loading loading-lg" />
            <div v-else-if="errorMessage" class="text-error">
              {{ errorMessage }}
            </div>
          </div>
        </div>

        <input
          ref="imageInput"
          type="file"
          class="file-input"
          :disabled="loading"
          @change="selectImage"
        >
        <button
          :disabled="!image || loading"
          class="btn btn-primary"
          @click="uploadImage"
        >
          <Icon name="tabler:photo-share" size="18" />
          Upload
        </button>
      </div>

      <ImageList :images="locationLog?.images || []" class="ml-2" />
    </div>
  </div>
</template>

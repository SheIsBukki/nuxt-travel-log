<script lang="ts" setup>
const props = defineProps<{
  label: string;
  name: string;
  type?: "text" | "textarea";
  error?: string;
  disabled?: boolean;
}>();
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ props.label }}
    </legend>

    <Field
      :disabled="disabled"
      :as="type || 'input'"
      :name="props.name"
      :type="type || 'text'"
      class="w-full"
      :class="{
        'input-error': props.error,
        'input': !type || type === 'text',
        'textarea': type === 'textarea',
      }"
    />
    <p v-if="props.error" class="fieldset-label text-error">
      {{ props.error }}
    </p>
  </fieldset>
</template>

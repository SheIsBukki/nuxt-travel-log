<script lang="ts" setup>
const props = defineProps<{
  label: string;
  name: string;
  value: number;
  type?: "text" | "textarea";
  error?: string;
  disabled?: boolean;
}>();

const { handleBlur, value: inputValue, handleChange } = useField<number>(props.name, { initialValues: props.value });

// To ensure that the date is in the user's timezone
function formatDateISO(value: number) {
  return new Date(value).toISOString().split("T")[0];
}

function dateChanged(event: Event) {
  const target = event.target as HTMLInputElement;
  handleChange(new Date(target.value).getTime());
}
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ props.label }}
    </legend>

    <input
      :disabled="disabled"
      :name="props.name"
      type="date"
      class="w-full input"
      :class="{
        'input-error': props.error,
      }"
      :value="formatDateISO(inputValue)"
      @change="dateChanged"
      @blur="handleBlur"
    >
    <p v-if="props.error" class="fieldset-label text-error">
      {{ props.error }}
    </p>
  </fieldset>
</template>

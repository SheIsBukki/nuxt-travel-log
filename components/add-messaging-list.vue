<script setup lang="ts">
const props = defineProps<{
  hasInnerIcon?: boolean;
  textAfterIcon?: string;
  text: string;
}>();
</script>

<template>
  <li class="flex items-center">
    <Icon name="tabler:arrow-badge-right" size="18" />
    {{ props.text }}
    <Icon
      v-if="hasInnerIcon"
      name="tabler:map-pin-filled"
      size="18"
      class="text-warning"
    />
    {{ props.textAfterIcon }}
  </li>
</template>

<script lang="ts" setup>
import type { RouteLocationRaw } from "vue-router";

const props = defineProps<{
  label: string;
  href?: string;
  to?: RouteLocationRaw;
  icon: string;
  showLabel: boolean;
  iconColour?: "text-accent" | "text-primary" | "text-secondary";
}>();

const route = useRoute();
</script>

<template>
  <div
    class="tooltip-right"
    :class="{ tooltip: !showLabel }"
    :data-tip="showLabel ? undefined : props.label"
  >
    <NuxtLink
      :to="props.href || props.to"
      class="flex flex-nowrap gap-2 p-2 hover:bg-base-300 hover:cursor-pointer"
      :class="{
        'bg-base-200': route.path === props.href,
        'justify-center': !showLabel,
        'justify-start': showLabel,
      }"
    >
      <Icon
        :name="props.icon"
        size="24"
        :class="iconColour"
      />
      <Transition name="grow">
        <span v-if="showLabel" class="truncate">{{ props.label }}</span>
      </Transition>
    </NuxtLink>
  </div>
</template>

<style scoped>
.grow-enter-active {
  animation: grow 0.1s;
}
.grow-leave-active {
  animation: grow 0.1s reverse;
}
@keyframes grow {
  0% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
}
</style>

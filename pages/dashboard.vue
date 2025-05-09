<script lang="ts" setup>
const isSidebarOpen = ref(true);
const route = useRoute();
const sidebarStore = useSidebarStore();
const locationsStore = useLocationStore();

onMounted(() => {
  isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === "true";

  if (route.path !== "/dashboard") {
    locationsStore.refresh();
  }
});

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem("isSidebarOpen", isSidebarOpen.value.toString());
}
</script>

<template>
  <div class="flex-1 flex">
    <div
      class="bg-base-100 transition-all duration-300 shrink-0"
      :class="{ 'w-64': isSidebarOpen, 'w-16': !isSidebarOpen }"
    >
      <div
        :class="{
          'justify-center': !isSidebarOpen,
          'justify-end': isSidebarOpen,
        }"
        class="flex hover:cursor-pointer hover:bg-base-200 p-2"
        @click="toggleSidebar"
      >
        <Icon
          v-if="isSidebarOpen"
          name="tabler:chevron-left"
          size="32"
        />
        <Icon
          v-else
          name="tabler:chevron-right"
          size="32"
        />
      </div>

      <div class="flex flex-col">
        <SidebarButton
          :show-label="isSidebarOpen"
          label="Locations"
          href="/dashboard"
          icon="tabler:map"
        />

        <SidebarButton
          :show-label="isSidebarOpen"
          label="Add Location"
          href="/dashboard/add"
          icon="tabler:circle-plus-filled"
        />

        <div v-if="sidebarStore.loading || sidebarStore.sidebarItems.length" class="divider" />
        <!-- Loading skeleton -->
        <div v-if="sidebarStore.loading" class="px-4 ">
          <div class="skeleton h-4 w-full" />
        </div>

        <!-- I will use this in production if there's no padding  -->
        <SidebarButton
          v-for="item in sidebarStore.sidebarItems"
          v-else-if="sidebarStore.sidebarItems.length"
          :key="item.id"
          :show-label="isSidebarOpen"
          :label="item.label"
          :icon="item.icon"
          :href="item.href"
        />

        <!-- The instructor thinks we have to wrap this SidebarButton above in a wrapper, using this div element to use the v-else on an element that uses v-for. when he did, there was an additional padding in the location list section so he decided to use a v-if with the negative loading check -->
        <!-- <div v-if="!sidebarStore.loading && sidebarStore.sidebarItems.length" class="flex flex-col">
        <SidebarButton
          v-for="item in sidebarStore.sidebarItems"

          :key="item.id"
          :show-label="isSidebarOpen"
          :label="item.label"
          :icon="item.icon"
          :href="item.href"
        />
        </div> -->

        <div class="divider" />
        <SidebarButton
          :show-label="isSidebarOpen"
          label="Sign Out"
          href="/sign-out"
          icon="tabler:logout-2"
        />
      </div>
    </div>

    <div class="flex-1 overflow-auto">
      <div class="flex flex-col size-full">
        <NuxtPage />
        <AppMap class="flex-1" />
      </div>
    </div>
  </div>
</template>

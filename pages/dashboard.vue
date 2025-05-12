<script lang="ts" setup>
import { isPointSelected } from "~/utils/map-points";

const isSidebarOpen = ref(true);
const route = useRoute();
const sidebarStore = useSidebarStore();
const locationsStore = useLocationStore();
const mapStore = useMapStore();

const { currentLocation } = storeToRefs(locationsStore);

onMounted(() => {
  isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === "true";
  if (route.path !== "/dashboard") {
    locationsStore.refreshLocations();
  }
});

effect(() => {
  if (route.name === "dashboard") {
    sidebarStore.sidebarTopItems = [
      {
        id: "link-dashboard",
        label: "Locations",
        href: "/dashboard",
        icon: "tabler:map",
      },
      {
        id: "link-location-add",
        label: "Add Location",
        href: "/dashboard/add",
        icon: "tabler:circle-plus-filled",
      },
    ];
  }
  else if (route.name === "dashboard-location-slug") {
    sidebarStore.sidebarTopItems = [
      {
        id: "link-dashboard",
        label: "Back to Locations",
        href: "/dashboard",
        icon: "tabler:arrow-left",
      },
      {
        id: "link-dashboard",
        label: currentLocation.value ? currentLocation.value.name : "View Logs",
        to: { name: "dashboard-location-slug", params: { slug: currentLocation.value?.slug } },
        icon: "tabler:map",
      },
      {
        id: "link-location-edit",
        label: "Edit Location",
        to: { name: "dashboard-location-slug-edit", params: { slug: currentLocation.value?.slug } },
        icon: "tabler:map-pin-cog",
      },
      {
        id: "link-location-add",
        label: "Add Location Log",
        to: { name: "dashboard-location-slug-add", params: { slug: currentLocation.value?.slug } },
        icon: "tabler:circle-plus-filled",
      },
    ];
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
          v-for="item in sidebarStore.sidebarTopItems"
          :key="item.id"
          :show-label="isSidebarOpen"
          :label="item.label"
          :href="item.href"
          :to="item.to"
          :icon="item.icon"
        />

        <!-- <SidebarButton
          :show-label="isSidebarOpen"
          label="Add Location"
          href="/dashboard/add"
          icon="tabler:circle-plus-filled"
        /> -->

        <div
          v-if="sidebarStore.loading || sidebarStore.sidebarItems.length"
          class="divider"
        />
        <!-- Loading skeleton -->
        <div v-if="sidebarStore.loading" class="px-4">
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
          :to="item.to"
          :icon-colour="
            isPointSelected(item.mapPoint, mapStore.selectedPoint)
              ? 'text-accent'
              : undefined
          "
          @mouseenter="mapStore.selectedPoint = item.mapPoint ?? null"
          @mouseleave="mapStore.selectedPoint = null"
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

            :icon-colour="mapStore.selectedPoint === item.location ? 'text-accent' : undefined"
            @mouseenter="mapStore.selectedPoint = item.location ?? null"
            @mouseleave="mapStore.selectedPoint = null"
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

    <div class="flex-1 overflow-auto bg-base-200">
      <div
        class="flex size-full"
        :class="{ 'flex-col ': route.path !== '/dashboard/add' }"
      >
        <NuxtPage />
        <AppMap class="flex-1" />
      </div>
    </div>
  </div>
</template>

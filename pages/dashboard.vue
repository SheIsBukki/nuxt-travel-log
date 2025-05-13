<script lang="ts" setup>
import {
  CURRENT_LOCATION_PAGES,
  EDIT_PAGES,
  LOCATION_PAGES,
} from "~/lib/constants";
import { isPointSelected } from "~/utils/map-points";

const isSidebarOpen = ref(true);
const route = useRoute();
const sidebarStore = useSidebarStore();
const locationsStore = useLocationStore();
const mapStore = useMapStore();

const { currentLocation, currentLocationStatus } = storeToRefs(locationsStore);

if (LOCATION_PAGES.has(route.name?.toString() || "")) {
  await locationsStore.refreshLocations();
}

if (CURRENT_LOCATION_PAGES.has(route.name?.toString() || "")) {
  await locationsStore.refreshCurrentLocation();
}

onMounted(() => {
  isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === "true";
});

effect(() => {
  if (LOCATION_PAGES.has(route.name?.toString() || "")) {
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
  else if (CURRENT_LOCATION_PAGES.has(route.name?.toString() || "")) {
    sidebarStore.sidebarTopItems = [
      {
        id: "link-dashboard",
        label: "Back to Locations",
        href: "/dashboard",
        icon: "tabler:arrow-left",
      },
    ];

    if (currentLocation.value && currentLocationStatus.value !== "pending") {
      sidebarStore.sidebarTopItems.push({
        id: "link-dashboard",
        label: currentLocation.value.name,
        to: {
          name: "dashboard-location-slug",
          params: { slug: route.params.slug },
        },
        icon: "tabler:map",
      }, {
        id: "link-location-edit",
        label: "Edit Location",
        to: {
          name: "dashboard-location-slug-edit",
          params: { slug: route.params.slug },
        },
        icon: "tabler:map-pin-cog",
      }, {
        id: "link-location-add",
        label: "Add Location Log",
        to: {
          name: "dashboard-location-slug-add",
          params: { slug: route.params.slug },
        },
        icon: "tabler:circle-plus-filled",
      });
    }
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

      <!-- Sidebar top section -->
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

        <div
          v-if="sidebarStore.loading || sidebarStore.sidebarItems.length"
          class="divider"
        />
        <!-- Loading skeleton -->
        <div v-if="sidebarStore.loading" class="px-4">
          <div class="skeleton h-4 w-full" />
        </div>

        <!-- I will use this in production if there's no padding  -->
        <!-- Sidebar bottom section -->
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
            :to="item.to"

            :icon-colour="isPointSelected(item.mapPoint, mapStore.selectedPoint)
              ? 'text-accent'
              : undefined"
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
        :class="{ 'flex-col ': !EDIT_PAGES.has(route.name?.toString() || '') }"
      >
        <NuxtPage
          :class="{
            'w-96 ': EDIT_PAGES.has(route.name?.toString() || ''),
            'shrink-0': EDIT_PAGES.has(route.name?.toString() || ''),
          }"
        />
        <AppMap class="flex-1" />
      </div>
    </div>
  </div>
</template>

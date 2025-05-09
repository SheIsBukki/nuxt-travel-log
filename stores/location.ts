export const useLocationStore = defineStore("useLocationStore", () => {
  const { data, status, refresh } = useFetch("/api/locations", { lazy: true });

  const sidebarStore = useSidebarStore();
  const mapStore = useMapStore();

  // watchEffect(() => { // This causes hydration mismatch
  effect(() => {
    if (data.value) {
      sidebarStore.loading = false;

      sidebarStore.sidebarItems = data.value.map(location => ({
        id: `location-${location.id}`,
        label: location.name,
        icon: "tabler:map-pin-filled",
        href: "#",
        location,
      }));

      mapStore.mapPoints = data.value.map(location => ({
        id: location.id,
        name: location.name,
        description: location.description,
        latitude: location.latitude,
        longitude: location.longitude,
      }));
    }

    sidebarStore.loading = status.value === "pending";
  });

  return {
    locations: data,
    status,
    refresh,
  };
});

<template>
  <div
    class="w-full h-dvh text-gray-200 space-y-6 pl-2 lg:py-8 md:py-6 py-8 max-lg:pr-2 overflow-y-scroll hidden-scrollbar"
  >
    <div class="uppercase text-[20px]">Control Panel</div>
    <div class="space-y-8 w-full">
      <div class="space-y-4">
        <template v-if="user.rootUser || accessible">
          <div class="text-[14px]">Routings</div>
          <div class="space-y-1 ml-2">
            <template
              v-for="route in user.rootUser
                ? routes.filter((x) => x.method === 'get')
                : routes.filter((x) =>
                    accessible.some((z) => z.route._id === x._id)
                  )"
              :key="route._id"
              @click="handleHideSidebar"
            >
              <NuxtLink
                :to="'/route' + route.path"
                class="flex items-center space-x-2 lg:hover:bg-blue-900 lg:hover:bg-opacity-60 lg:hover:rounded-[10px] lg:hover:text-gray-100 duration-200 p-2"
                :active-class="'bg-blue-900 rounded-[10px] text-gray-100 lg:hover:text-gray-100'"
                @click="handleHideSidebar"
              >
                <i class="fa-solid fa-link fa-lg"></i>
                <span>{{ route.path }}</span>
              </NuxtLink>
            </template>
          </div>
        </template>
        <div class="text-[14px]">Settings</div>
        <div class="space-y-3 ml-2">
          <NuxtLink
            :to="'/me'"
            class="flex items-center space-x-2 lg:hover:bg-blue-900 lg:hover:bg-opacity-60 lg:hover:rounded-[10px] lg:hover:text-gray-100 duration-200 p-2"
            :active-class="'bg-blue-900 rounded-[10px] text-gray-100 lg:hover:text-gray-100'"
            @click="handleHideSidebar"
          >
            <i class="fa-solid fa-user fa-lg"></i>
            <span>Account</span>
          </NuxtLink>
          <NuxtLink
            :to="'/'"
            class="flex items-center space-x-2 lg:hover:bg-blue-900 lg:hover:bg-opacity-60 lg:hover:rounded-[10px] lg:hover:text-gray-100 duration-200 p-2"
            :active-class="'bg-blue-900 rounded-[10px] text-gray-100 lg:hover:text-gray-100'"
            @click="handleHideSidebar"
          >
            <i class="fa-solid fa-upload fa-lg"></i>
            <span>Upload</span>
          </NuxtLink>
          <NuxtLink
            :to="'/'"
            class="flex items-center space-x-2 lg:hover:bg-blue-900 lg:hover:bg-opacity-60 lg:hover:rounded-[10px] lg:hover:text-gray-100 duration-200 p-2"
            :active-class="'bg-blue-900 rounded-[10px] text-gray-100 lg:hover:text-gray-100'"
            @click="handleHideSidebar"
          >
            <i class="fa-solid fa-gear fa-lg"></i>
            <span>Setting</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const { hideSidebar, routes, permissions } = useGetState();
const { user } = useAuth();
const { screenWidth } = useGetState();
async function handleFetchRoute() {
  const params = {
    limit: 0,
  };
  const fetchRoute: any = await useApi("/route", { params });
  routes.value = fetchRoute.data;
}

async function handleFetchPermission() {
  const fields = ["route.*", "permission", "roles"];
  const params = {
    fields: fields.join(","),
    limit: 0,
  };
  const fetchPermission: any = await useApi("/permission", { params });
  permissions.value = fetchPermission.data;
}

const accessible = computed(() =>
  permissions.value.filter(
    (x) => x.route.method === "get" && x.roles.includes(user.value.role)
  )
);

await handleFetchRoute();
await handleFetchPermission();

function handleHideSidebar() {
  if (screenWidth.value <= 768 && !hideSidebar.value) hideSidebar.value = true;
}
</script>

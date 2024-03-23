<template>
  <div
    class="w-full max-h-full h-full text-gray-200 space-y-6 pl-2 lg:py-8 md:py-6 py-4 max-lg:pr-2"
  >
    <div class="uppercase text-center text-[20px]">admin dashboard</div>
    <div
      class="space-y-8 max-h-full w-full h-full overflow-y-scroll hidden-scrollbar"
    >
      <div class="space-y-4">
        <div class="text-[14px]">Routings</div>
        <div class="space-y-1 ml-2">
          <div
            v-for="route in routes"
            :key="route._id"
            @click="handleHideSidebar"
          >
            <template
              v-if="
                route.permission
                  .filter((x) => x.method === 'get')
                  .find((x) => x.roles.includes(user.role)) ||
                route.permission.find((x) => x.public === true) ||
                user.rootUser
              "
            >
              <NuxtLink
                :to="'/route/' + route.path"
                v-if="!excludeRoute.includes(route.path)"
                class="flex items-center space-x-2 hover:bg-blue-900 hover:bg-opacity-60 hover:rounded-[10px] hover:text-gray-100 duration-200 p-2"
                :active-class="'bg-blue-900 rounded-[10px] text-gray-100 hover:text-gray-100'"
              >
                <i class="fa-solid fa-link fa-lg"></i>
                <span>{{ route.path }}</span>
              </NuxtLink>
            </template>
          </div>
        </div>
        <div class="text-[14px]">Settings</div>
        <div class="space-y-3 ml-2">
          <NuxtLink
            :to="'/me'"
            class="flex items-center space-x-2 hover:bg-blue-900 hover:bg-opacity-60 hover:rounded-[10px] hover:text-gray-100 duration-200 p-2"
            :active-class="'bg-blue-900 rounded-[10px] text-gray-100 hover:text-gray-100'"
            @click="handleHideSidebar"
          >
            <i class="fa-solid fa-user fa-lg"></i>
            <span>Account</span></NuxtLink
          >
          <NuxtLink
            :to="'/'"
            class="flex items-center space-x-2 hover:bg-blue-900 hover:bg-opacity-60 hover:rounded-[10px] hover:text-gray-100 duration-200 p-2"
            :active-class="'bg-blue-900 rounded-[10px] text-gray-100 hover:text-gray-100'"
            @click="handleHideSidebar"
          >
            <i class="fa-solid fa-upload fa-lg"></i>
            <span>Upload</span>
          </NuxtLink>
          <NuxtLink
            :to="'/'"
            class="flex items-center space-x-2 hover:bg-blue-900 hover:bg-opacity-60 hover:rounded-[10px] hover:text-gray-100 duration-200 p-2"
            :active-class="'bg-blue-900 rounded-[10px] text-gray-100 hover:text-gray-100'"
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
const excludeRoute = [
  "assets",
  "mail",
  "setting",
  "me",
  "upload",
  "schema",
  "refreshtoken",
  "api/route",
];
const routes = ref<
  {
    _id: string;
    path: string;
    permission: {
      _id: string;
      path: string;
      method: string;
      roles: string[];
      public: boolean;
    }[];
  }[]
>([]);
const { user } = useAuth();
const { screenWidth } = useGetState();
const hideSidebar = useState<boolean>("hideSidebar");
const handleFetchRoute = async () => {
  const fieldArr = ["path", "permission.*"];
  const params = {
    fields: fieldArr.join(","),
    limit: 0,
  };
  const fetchRoute: any = await useApi("/api/route", { params });
  routes.value = fetchRoute.data;
};
await handleFetchRoute();

function handleHideSidebar() {
  if (screenWidth.value <= 768 && !hideSidebar.value) hideSidebar.value = true;
}
</script>

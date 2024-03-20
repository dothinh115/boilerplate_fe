<template>
  <div
    class="w-full max-h-full flex flex-col justify-between p-8 text-gray-200 space-y-6"
  >
    <div class="uppercase text-center text-[28px]" @click="handleFetchRoute">
      admin dashboard
    </div>
    <div
      class="space-y-8 max-h-full w-full h-full overflow-y-scroll hidden-scrollbar"
    >
      <div class="space-y-4">
        <div class="text-[14px]">Routings</div>
        <div class="space-y-1 ml-2">
          <div v-for="route in routes" :key="route._id">
            <NuxtLink
              :to="'/route/' + route.path"
              v-if="!excludeRoute.includes(route.path)"
              class="flex items-center space-x-2 hover:bg-blue-900 hover:bg-opacity-60 hover:rounded-[10px] hover:text-gray-100 duration-200 p-2"
              :active-class="'bg-blue-900 rounded-[10px] text-gray-100 hover:text-gray-100'"
            >
              <ion-icon name="link-outline" size="large"></ion-icon>
              <span>{{ route.path }}</span>
            </NuxtLink>
          </div>
        </div>
        <div class="text-[14px]">Settings</div>
        <div class="space-y-3 ml-2">
          <NuxtLink
            :to="'/'"
            class="flex items-center space-x-2 hover:bg-blue-900 hover:bg-opacity-60 hover:rounded-[10px] hover:text-gray-100 duration-200 p-2"
            :active-class="'bg-blue-900 rounded-[10px] text-gray-100 hover:text-gray-100'"
          >
            <ion-icon name="person-outline" size="large"></ion-icon>
            <span>Account</span></NuxtLink
          >
          <NuxtLink
            :to="'/'"
            class="flex items-center space-x-2 hover:bg-blue-900 hover:bg-opacity-60 hover:rounded-[10px] hover:text-gray-100 duration-200 p-2"
            :active-class="'bg-blue-900 rounded-[10px] text-gray-100 hover:text-gray-100'"
          >
            <ion-icon name="cloud-upload-outline" size="large"></ion-icon>
            <span>Upload</span>
          </NuxtLink>
          <NuxtLink
            :to="'/'"
            class="flex items-center space-x-2 hover:bg-blue-900 hover:bg-opacity-60 hover:rounded-[10px] hover:text-gray-100 duration-200 p-2"
            :active-class="'bg-blue-900 rounded-[10px] text-gray-100 hover:text-gray-100'"
          >
            <ion-icon name="settings-outline" size="large"></ion-icon>
            <span>Setting</span>
          </NuxtLink>
        </div>
      </div>
    </div>
    <div>
      <div
        @click.prevent="logout"
        class="flex items-center space-x-2 hover:text-gray-400 duration-300 cursor-pointer"
      >
        <ion-icon
          name="log-out-outline"
          size="large"
          class="rotate-180"
        ></ion-icon>
        <span>Logout ({{ user.email }})</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const { user, logout } = useAuth();
const excludeRoute = ["assets", "mail", "setting", "me"];
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
</script>

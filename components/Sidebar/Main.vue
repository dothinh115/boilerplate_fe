<template>
  <div
    class="w-full h-dvh text-gray-200 overflow-y-scroll hidden-scrollbar xl:px-6 px-2 bg-indigo-600 bg-opacity-90 space-y-8"
  >
    <div class="uppercase xl:text-[20px] text-[16px] mt-8 ml-2">
      <span class="bg-indigo-500 xl:p-2 p-1 text-gray-50 rounded-[8px] ring-2"
        >Control Panel</span
      >
    </div>
    <SidebarGroup :title="'Routings'">
      <SidebarGroupItem
        v-for="(route, index) in routes.filter((x) => {
          const isGet = x.method === 'GET';
          const isVisible = !x.isHidden;
          const canAccess =
            (user.role && (x.roles.includes(user.role) || !x.isProtected)) ||
            (!user.role && !x.isProtected);
          const isRootUser = user.rootUser;
          return isGet && ((isVisible && canAccess) || isRootUser);
        })"
        :key="route.id"
        :to="'/route' + route.path"
        :title="route.path"
      >
        <template #icon><i class="fa-solid fa-link"></i></template>
      </SidebarGroupItem>
    </SidebarGroup>
    <SidebarGroup :title="'Settings'">
      <SidebarGroupItem :to="'/me'" :title="'Account'">
        <template #icon> <i class="fa-solid fa-user"></i></template>
      </SidebarGroupItem>
      <SidebarGroupItem
        :title="'Upload'"
        :to="'/upload'"
        v-if="$roleCheck('GET', 'file')"
      >
        <template #icon>
          <i class="fa-solid fa-upload"></i>
        </template>
      </SidebarGroupItem>
      <SidebarGroupItem :title="'Setting'">
        <template #icon>
          <i class="fa-solid fa-gear"></i>
        </template>
      </SidebarGroupItem>
    </SidebarGroup>
  </div>
</template>
<script setup lang="ts">
const { routes } = useGetState();
const { user } = useAuth();
async function handleFetchRoute() {
  const params = {
    limit: 0,
  };
  const fetchRoute: any = await useApi("/route", { params });
  console.log(fetchRoute.data);
  routes.value = fetchRoute.data;
}

await handleFetchRoute();
</script>

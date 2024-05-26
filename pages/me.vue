<template>
  <div class="h-full flex-col max-h-full space-y-4 xl:w-[70%] w-full mx-auto">
    <div
      class="max-h-[85%] overflow-y-scroll hidden-scrollbar space-y-[1px] !mt-[1px] rounded-b-[10px] rounded-t-[10px] relative"
    >
      <div
        class="p-2 bg-indigo-600 text-gray-100 flex items-center space-x-2 w-max min-w-full sticky top-0 text-[20px]"
      >
        Thông tin cá nhân
      </div>
      <template v-for="(key, index) in Object.keys(schema)" :key="index">
        <NuxtLink
          class="flex items-center justify-between odd:bg-gray-50 even:bg-gray-200 p-2"
          v-if="key !== 'rootUser'"
          :to="
            !schema[key].disabled
              ? {
                  name: 'me-field',
                  params: {
                    field: key,
                  },
                }
              : undefined
          "
        >
          <div class="text-gray-900 text-[16px]">{{ key }}</div>
          <div
            class="text-indigo-900 font-bold xl:max-w-[250px] md:max-w-[200px] max-w-[140px]"
          >
            <i
              class="fa-solid fa-chevron-right"
              v-if="!schema[key].disabled"
            ></i>
            <div v-else class="truncate">{{ user[key] }}</div>
          </div>
        </NuxtLink>
      </template>
    </div>
  </div>
  <NuxtPage />
</template>
<script setup lang="ts">
const { user } = useAuth();
const schemaApi = "/schema/user";
const schema = useState<any>(schemaApi, () => {});
const { loading } = useGetState();

const changePasswordSuccess = ref(false);
const changePasswordLoading = ref(false);

async function getSchema() {
  if (schema.value) return;
  const result: any = await useApi(schemaApi);
  schema.value = result.data;
}
async function handleFetch() {
  loading.value = true;
  await getSchema();
  loading.value = false;
}

await handleFetch();
</script>

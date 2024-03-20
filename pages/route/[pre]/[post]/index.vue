<template>
  <div class="flex h-full flex-col max-h-full justify-between space-y-4">
    <div
      class="p-2 bg-indigo-600 text-gray-100 rounded-t-[10px] last:rounded-b-[10px] flex items-center space-x-2"
    >
      <div
        v-for="(item, index) in Object.keys(schema)"
        :key="index"
        :class="{
          'w-[5%]': index === 0,
          'w-[30%]': index === 1,
          'flex-1': index !== 0 && index !== 1,
        }"
      >
        {{ item }}
      </div>
    </div>
    <div
      class="max-h-full h-full overflow-y-scroll hidden-scrollbar space-y-[1px] !mt-[1px]"
    >
      <NuxtLink
        v-for="list in lists"
        :key="list._id"
        class="p-2 bg-gray-100 last:rounded-b-[10px] flex items-center space-x-2 hover:bg-gray-200 duration-100"
        :to="`/route/${route.params.pre}/${route.params.post}/${list._id}`"
      >
        <div
          v-for="(key, index) in Object.keys(schema)"
          :key="index"
          class="line-clamp-1"
          :class="{
            'w-[5%]': index === 0,
            'w-[30%]': index === 1,
            'flex-1': index !== 0 && index !== 1,
          }"
        >
          {{ list[key] }}
        </div>
      </NuxtLink>
    </div>
    <div class="flex space-x-2 items-center text-[14px]">
      <NuxtLink
        :to="
          currentPage > 1
            ? {
                query: {
                  page: currentPage - 1,
                },
              }
            : undefined
        "
        class="bg-indigo-200 p-1 rounded-[10px] min-w-[35px] flex justify-center border border-indigo-100 h-[35px] items-center text-gray-800"
        :class="{
          'opacity-50': currentPage === 1,
        }"
      >
        <ion-icon name="chevron-back-outline"> </ion-icon>
      </NuxtLink>
      <NuxtLink
        v-for="(item, index) in pagination"
        :key="index"
        :to="
          typeof item === 'number'
            ? {
                query: {
                  page: item,
                },
              }
            : undefined
        "
        :class="{
          'bg-indigo-600 bg-opacity-90 text-gray-100': item === currentPage,
          'bg-indigo-200 p-1 rounded-[10px] min-w-[35px] h-[35px] flex justify-center border items-center hover:bg-indigo-600 hover:text-gray-100 duration-200':
            typeof item === 'number',
          'text-gray-100': typeof item !== 'number',
        }"
      >
        {{ item }}
      </NuxtLink>

      <NuxtLink
        :to="
          currentPage < totalPages
            ? {
                query: {
                  page: currentPage + 1,
                },
              }
            : undefined
        "
        class="bg-indigo-200 p-1 rounded-[10px] min-w-[35px] flex justify-center border border-indigo-400 h-[35px] items-center text-gray-800"
        :class="{
          'opacity-50': currentPage === totalPages,
        }"
      >
        <ion-icon name="chevron-forward-outline"></ion-icon>
      </NuxtLink>
    </div>
  </div>
</template>
<script setup lang="ts">
const route = useRoute();
const api = `/${route.params.pre}/${route.params.post}`;
const lists = ref<any>([]);
const currentPage = ref(Number(route.query.page) || 1);
const perPage = 20;
const totalPages = ref(0);
const pagination = ref<(string | number)[]>([]);
const schema = ref<any>(null);
const loading = useState("loading");

async function getList() {
  const params = {
    limit: perPage,
    page: currentPage.value,
    meta: "*",
  };
  const result: any = await useApi(api, { params });
  totalPages.value = Math.ceil(
    (result.meta.total_count || result.meta.filter_count) / perPage
  );
  lists.value = result.data;
  return result;
}

async function getSchema() {
  const result: any = await useApi(`/schema/${route.params.post}`);
  schema.value = result;
}

watchEffect(async () => {});

watch(
  () => route.query.page,
  async (newValue) => {
    currentPage.value = Number(newValue);
    if (!route.query.page) currentPage.value = 1;
    loading.value = true;

    await getList();
    usePaginate(
      {
        totalPages: totalPages.value,
        currentPage: currentPage.value,
        range: 2,
      },
      (paginate: (string | number)[]) => {
        pagination.value = paginate;
      }
    );
    loading.value = false;
  },
  {
    immediate: true,
  }
);

async function fetchAll() {
  loading.value = true;
  await Promise.all([getSchema(), getList()]);
  loading.value = false;
}

await fetchAll();
</script>

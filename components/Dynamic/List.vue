<template>
  <div class="flex h-full flex-col max-h-full space-y-4">
    <div
      class="max-h-full overflow-y-scroll hidden-scrollbar space-y-[1px] !mt-[1px] rounded-b-[10px] rounded-t-[10px]"
    >
      <div
        class="p-2 bg-indigo-600 text-gray-100 flex items-center space-x-2 w-max min-w-full"
      >
        <div
          v-for="(key, index) in Object.keys(schema)"
          :key="index"
          :class="{
            'w-[50px]': key === '_id',
            'w-[400px]':
              schema[key].input === 'text' || schema[key].input === 'richText',
            'w-[200px]':
              (schema[key].input === 'array' ||
                schema[key].input === 'password') &&
              key !== '_id',
            'w-[100px]':
              schema[key].input === 'number' || schema[key].input === 'boolean',
          }"
        >
          {{ key }}
        </div>
      </div>
      <NuxtLink
        v-for="list in lists"
        :key="list._id"
        class="p-2 odd:bg-gray-50 even:bg-gray-200 hover:bg-opacity-90 flex items-center space-x-2 duration-100 last:rounded-b-[10px] w-max min-w-full"
        :to="`/route/${route.params.pre}/${route.params.post}/${list._id}`"
      >
        <div
          v-for="(key, index) in Object.keys(schema)"
          :key="index"
          class="line-clamp-1 truncate"
          :class="{
            'w-[50px]': key === '_id',
            'w-[400px]':
              schema[key].input === 'text' || schema[key].input === 'richText',
            'w-[200px]':
              (schema[key].input === 'array' ||
                schema[key].input === 'password') &&
              key !== '_id',
            'w-[100px]':
              schema[key].input === 'number' || schema[key].input === 'boolean',
          }"
        >
          <p class="truncate">
            {{ key === "password" ? "********" : list[key] }}
          </p>
        </div>
      </NuxtLink>
    </div>
    <div class="flex items-center justify-between w-full">
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
          class="bg-indigo-200 p-1 rounded-[10px] min-w-[35px] flex justify-center border border-indigo-100 h-[35px] items-center text-gray-800 hover:bg-indigo-600 hover:text-gray-100 duration-200"
          :class="{
            'opacity-50': currentPage === 1,
          }"
        >
          <i class="fa-solid fa-chevron-left"></i>
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
          class="bg-indigo-200 p-1 rounded-[10px] min-w-[35px] flex justify-center border border-indigo-400 h-[35px] items-center text-gray-800 hover:bg-indigo-600 hover:text-gray-100 duration-200"
          :class="{
            'opacity-50': currentPage === totalPages,
          }"
        >
          <i class="fa-solid fa-chevron-right"></i>
        </NuxtLink>
      </div>
      <div class="flex space-x-2 items-center">
        <NuxtLink
          :to="`/route/${route.params.pre}/${route.params.post}/new`"
          class="btn btn-green btn-icon"
        >
          <i class="fa-solid fa-plus"></i><span>Thêm mới</span>
        </NuxtLink>
        <button class="btn btn-blue btn-icon">
          <i class="fa-solid fa-magnifying-glass"></i><span>Tìm kiếm</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
type TProps = {
  api: {
    listApi: string;
    schemaApi: string;
  };
};
const props = defineProps<TProps>();
const route = useRoute();
const listApi = props.api.listApi;
const schemaApi = props.api.schemaApi;
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
    sort: "-_id",
  };
  const result: any = await useApi(listApi, { params });
  totalPages.value = Math.ceil(
    (result.meta.total_count || result.meta.filter_count) / perPage
  );
  lists.value = result.data;
  return result;
}

async function getSchema() {
  const result: any = await useApi(schemaApi);
  schema.value = result.data;
}

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
  }
);

onBeforeRouteUpdate(async () => {
  await getList();
});

async function fetchAll() {
  loading.value = true;
  await Promise.all([getSchema(), getList()]);
  loading.value = false;
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
}

await fetchAll();
</script>

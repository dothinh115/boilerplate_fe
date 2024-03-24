<template>
  <div class="flex h-full flex-col max-h-full space-y-4">
    <div
      class="max-h-full overflow-y-scroll hidden-scrollbar space-y-[1px] !mt-[1px] rounded-b-[10px] rounded-t-[10px] relative"
    >
      <div
        class="p-2 bg-indigo-600 text-gray-100 flex items-center space-x-2 w-max min-w-full sticky top-0"
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
          class="flex space-x-2 group cursor-pointer items-center"
          @click="handleSort(key)"
        >
          <span> {{ key }} </span>
          <i
            class="fa-solid fa-caret-down hidden items-center group-hover:inline-block"
            :class="{
              '!inline-block': sortBy === key || sortBy.slice(1) === key,
              'rotate-180': (sortBy as string).startsWith('-') && sortBy.slice(1) === key
            }"
          ></i>
        </div>
      </div>
      <NuxtLink
        v-for="list in lists"
        :key="list._id"
        class="p-2 odd:bg-gray-50 even:bg-gray-200 hover:bg-opacity-90 flex items-center space-x-2 duration-100 last:rounded-b-[10px] w-max min-w-full"
        :to="{
          name: 'route-pre-post-id',
          params: {
            ...(route.params.post
              ? {
                  pre: route.params.pre,
                  post: route.params.post,
                }
              : {
                  pre: 'api',
                  post: route.params.pre,
                }),
            id: list._id,
          },
          query: route.query,
        }"
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
            <span
              :class="{
                'p-1 rounded-[10px]': schema[key].input === 'boolean',
                'bg-red-400 text-gray-50':
                  schema[key].input === 'boolean' && list[key] === false,
                'bg-green-900 text-gray-50':
                  schema[key].input === 'boolean' && list[key] === true,
              }"
            >
              {{ key === "password" ? "********" : list[key] }}</span
            >
          </p>
        </div>
      </NuxtLink>
      <div
        class="p-2 odd:bg-gray-50 even:bg-gray-200 hover:bg-opacity-90 flex items-center space-x-2 duration-100 last:rounded-b-[10px] w-max min-w-full"
        v-if="lists.length === 0"
      >
        Chưa có record nào.
      </div>
    </div>
    <div
      class="flex items-center justify-between w-full max-md:flex-wrap max-md:space-y-4"
    >
      <div class="flex space-x-2 items-center text-[14px]">
        <NuxtLink
          :to="
            currentPage > 1
              ? {
                  query: {
                    ...route.query,
                    page: currentPage - 1,
                  },
                }
              : undefined
          "
          class="paginate"
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
                    ...route.query,
                    page: item,
                  },
                }
              : undefined
          "
          :class="{
            '!bg-indigo-600 bg-opacity-90 !text-gray-100': item === currentPage,
            paginate: typeof item === 'number',
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
                    ...route.query,
                    page: currentPage + 1,
                  },
                }
              : undefined
          "
          class="paginate"
          :class="{
            'opacity-50': currentPage === totalPages,
          }"
        >
          <i class="fa-solid fa-chevron-right"></i>
        </NuxtLink>
      </div>
      <div class="flex space-x-2 items-center max-md:w-full">
        <NuxtLink
          :to="{
            name: 'route-pre-post-new',
            params: {
              ...(route.params.post
                ? {
                    pre: route.params.pre,
                    post: route.params.post,
                  }
                : {
                    pre: 'api',
                    post: route.params.pre,
                  }),
            },
            query: {
              ...route.query,
            },
          }"
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
const router = useRouter();
const listApi = props.api.listApi;
const schemaApi = props.api.schemaApi;
const currentPage = ref(Number(route.query.page) || 1);
const perPage = 20;
const totalPages = ref(0);
const pagination = ref<(string | number)[]>([]);
const { loading, screenWidth } = useGetState();
const lists = ref<any>(null);
const schema = useState<any>(schemaApi);
const sortBy = ref(route.query.sort || "-_id");

async function getList() {
  const params = {
    limit: perPage,
    page: currentPage.value,
    meta: "*",
    sort: sortBy.value,
  };
  const result: any = await useApi(listApi, { params });
  totalPages.value = Math.ceil(
    (result.meta.total_count || result.meta.filter_count) / perPage
  );
  lists.value = result.data;
  return result;
}

async function getSchema() {
  if (schema.value) return;
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
        range: screenWidth.value <= 768 ? 1 : 2,
      },
      (paginate: (string | number)[]) => {
        pagination.value = paginate;
      }
    );
    loading.value = false;
  }
);

onBeforeRouteUpdate(async (to, from) => {
  if (
    from.name?.toString().includes(to.name?.toString() as string) &&
    from.name !== to.name
  ) {
    loading.value = true;
    await getList();
    loading.value = false;
  }
});

function handleSort(key: string) {
  if (!sortBy.value) sortBy.value = "-_id";
  if ((sortBy.value as string).startsWith("-")) {
    router.replace({
      query: {
        ...route.query,
        sort: key,
      },
    });
  } else {
    router.replace({
      query: {
        ...route.query,
        sort: sortBy.value === key ? "-" + key : key,
      },
    });
  }
}

watch(
  () => route.query.sort,
  async (newVal) => {
    if (newVal) {
      sortBy.value = newVal;
      loading.value = true;
      await getList();
      loading.value = false;
    }
  }
);

async function fetchAll() {
  loading.value = true;
  await Promise.all([getSchema(), getList()]);
  loading.value = false;
  usePaginate(
    {
      totalPages: totalPages.value,
      currentPage: currentPage.value,
      range: screenWidth.value <= 768 ? 1 : 2,
    },
    (paginate: (string | number)[]) => {
      pagination.value = paginate;
    }
  );
}

await fetchAll();
</script>

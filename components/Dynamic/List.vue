<template>
  <div class="h-full flex-col max-h-full space-y-4">
    <div
      class="max-h-[85%] overflow-y-scroll hidden-scrollbar space-y-[1px] !mt-[1px] rounded-b-[10px] rounded-t-[10px] relative"
    >
      <div
        class="p-2 bg-indigo-600 text-gray-100 flex items-center space-x-2 w-max min-w-full sticky top-0"
      >
        <DynamicListItem
          :schema="schema"
          :sortBy="sortBy"
          @handleSort="handleSort"
          :width="width"
        />
      </div>
      <DynamicListItem
        v-for="item in data"
        :key="item._id"
        :schema="schema"
        :sortBy="sortBy"
        :item="item"
        :width="width"
      />
      <div
        class="p-2 odd:bg-gray-50 even:bg-gray-200 lg:hover:bg-opacity-90 flex items-center space-x-2 duration-100 last:rounded-b-[10px] w-max min-w-full"
        v-if="data.length === 0"
      >
        {{
          isSearching ? "Không tìm thấy kết quả nào." : "Chưa có record nào."
        }}
      </div>
    </div>

    <div class="mb-2 flex items-center" v-if="isSearching">
      <div class="py-1 px-2 bg-indigo-100 w-fit rounded-l-[10px]">
        Đang lọc theo trường {{ route.query.field }} với giá trị '{{
          route.query.value
        }}'
      </div>
      <button
        class="py-1 px-2 bg-indigo-300 rounded-r-[10px] lg:cursor-pointer lg:hover:bg-red-600 lg:hover:text-white duration-200"
        @click="clearSearch"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
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
            name: 'route-post-new',
            params: {
              post: route.params.post,
            },
            query: {
              ...route.query,
            },
          }"
          class="btn btn-green btn-icon"
          v-if="$roleCheck('post', route.params.post as string)"
        >
          <i class="fa-solid fa-plus"></i><span>Thêm mới</span>
        </NuxtLink>
        <button class="btn btn-blue btn-icon" @click="searchModal = true">
          <i class="fa-solid fa-magnifying-glass"></i><span>Tìm kiếm</span>
        </button>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <Modal v-model="searchModal">
      <Search
        :schema="schema"
        @close="searchModal = false"
        @searchConfirm="searchConfirm"
        :searching="{
          field:route.query.field as string,
          searchKey: route.query.key as string,
          searchValue: route.query.value as string
        }"
    /></Modal>
  </Teleport>
</template>
<script setup lang="ts">
type TProps = {
  api: {
    dataApi: string;
    schemaApi: string;
  };
};
const props = defineProps<TProps>();
const route = useRoute();
const router = useRouter();
const dataApi = props.api.dataApi;
const schemaApi = props.api.schemaApi;
const currentPage = ref(Number(route.query.page) || 1);
const perPage = 20;
const totalPages = ref(0);
const pagination = ref<(string | number)[]>([]);
const { loading, screenWidth, routes } = useGetState();
const data = ref<any>(null);
const schema = useState<any>(schemaApi);
const sortBy = ref<string>((route.query.sort as string) || "-_id");
const width = ref<{
  [key: string]: number;
}>({});
const searchModal = ref(false);
const { $getMaxLength } = useNuxtApp();
const { user } = useAuth();

async function getList() {
  const searchData = route.query;
  const { field, key, value } = searchData;
  const params = {
    limit: perPage,
    page: currentPage.value,
    meta: "*",
    sort: sortBy.value,
    ...(field &&
      key &&
      value && {
        [`filter[${field}][${key}]`]: value,
      }),
  };
  const result: any = await useApi(dataApi, { params });
  totalPages.value = Math.ceil(
    (field && key && value
      ? result.meta.filter_count
      : result.meta.total_count) / perPage
  );
  data.value = result.data;
}

async function getSchema() {
  if (schema.value) return;
  const result: any = await useApi(schemaApi);
  schema.value = result.data;
}

const isSearching = computed(
  () => route.query.field && route.query.key && route.query.value
);

async function searchConfirm(searchData: {
  field: string;
  searchKey: string;
  searchValue: string;
}) {
  const { field, searchKey, searchValue } = searchData;
  await navigateTo(
    {
      query: {
        ...route.query,
        field,
        key: searchKey,
        value: searchValue,
      },
    },
    { replace: true }
  );
  searchModal.value = false;
}

async function clearSearch() {
  await navigateTo(
    {
      query: {
        field: undefined,
        key: undefined,
        value: undefined,
      },
    },
    { replace: true }
  );
  loading.value = true;
  await getList();
  loading.value = false;
}

watch(
  () => [route.query.field, route.query.key, route.query.value],
  async ([field, key, value]) => {
    if (field && key && value) {
      loading.value = true;
      await getList();
      loading.value = false;
    }
  }
);

watchEffect(() => {
  usePaginate(
    {
      totalPages: totalPages.value || 0,
      currentPage: currentPage.value,
      range: screenWidth.value <= 768 ? 1 : 2,
    },
    (paginate: (string | number)[]) => {
      pagination.value = paginate;
    }
  );
});

watch(
  () => route.query.page,
  async (newValue) => {
    currentPage.value = Number(newValue);
    if (!route.query.page) currentPage.value = 1;
    loading.value = true;
    await getList();
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
      sortBy.value = newVal as string;
      loading.value = true;
      await getList();
      loading.value = false;
    }
  }
);

async function fetchAll() {
  loading.value = true;
  await getSchema();
  await getList();
  loading.value = false;
}

await fetchAll();

width.value = $getMaxLength({ schema: schema.value, data: data.value });
</script>

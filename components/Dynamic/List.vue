<template>
  <div class="h-full flex-col max-h-full space-y-4">
    <div class="flex items-center justify-between flex-wrap-reverse">
      <div
        :class="{
          'max-md:w-full': isFiltering,
        }"
      >
        <div
          v-if="isFiltering"
          class="max-md:flex-wrap-reverse flex items-center max-md:mt-2"
        >
          <div class="py-2 px-4 bg-gray-100 rounded-l-full text-gray-800">
            Đang áp dụng filter.
          </div>
          <div
            class="py-2 px-4 bg-lime-200 text-gray-800 cursor-pointer"
            @click.stop="
              () => {
                if (screenWidth < 768) modalFilter = true;
                else isSearching = true;
              }
            "
          >
            Xem filter
          </div>
          <div
            class="py-2 px-4 bg-red-500 rounded-r-full text-gray-100 cursor-pointer"
            @click.stop="handleUnApplyFilter()"
          >
            <i class="fa-solid fa-x"></i>
          </div>
        </div>
        <span class="text-[30px] text-gray-200" v-else>
          {{ "/" + route.params.post }}
        </span>
      </div>
      <div
        class="max-md:space-x-2 space-x-4 flex max-md:justify-end"
        :class="{
          'max-md:w-full': isFiltering,
        }"
      >
        <div
          class="relative h-[40px] md:aspect-2 aspect-1 bg-transparent border-gray-200 rounded-full cursor-pointer flex items-center text-gray-200 hover:bg-gray-200 z-[1] duration-200"
          :class="{
            '!aspect-[10] !cursor-auto hover:bg-transparent': isSearching,
            'border hover:text-indigo-800': !isSearching,
          }"
          v-click-outside="
            () => {
              isSearching = false;
            }
          "
        >
          <div
            class="flex items-center md:justify-between justify-center w-full text-[18px] p-2"
            :class="{
              'text-indigo-800': isSearching,
            }"
            v-if="!isSearching"
            @click.stop="
              () => {
                if (screenWidth < 768) modalFilter = true;
                else isSearching = true;
              }
            "
          >
            <i class="fa-solid fa-magnifying-glass"></i>
            <i class="fa-solid fa-sort md:inline-block hidden"></i>
          </div>
          <div
            class="absolute w-full top-0 left-0 max-h-fit rounded-[15px] overflow-hidden duration-200 bg-gray-50 border border-gray-300"
            :class="{
              'py-2': Object.keys(searchObject).length > 0,
            }"
            v-show="isSearching"
          >
            <Search
              :searchObject
              :deep="0"
              :type="'object'"
              :schema
              @updateSearchObject="updateSearchObject"
            />
            <div class="p-1 space-y-2">
              <div
                v-for="(item, index) in filterArr"
                :key="index"
                class="flex space-x-2 items-center"
              >
                <span class="text-gray-400">filter</span>
                <input
                  type="text"
                  class="rounded-full border border-gray-200 outline-none w-full py-1 px-2 text-indigo-500 !ml-1"
                  v-model="filterArr[index]"
                />
                <button
                  class="border border-gray-200 rounded-full flex-shrink-0 h-[30px] aspect-1 hover:text-red-500 hover:border-red-500 duration-200"
                  @click.stop="handleRemoveFilter(index)"
                >
                  <i class="fa-solid fa-minus"></i>
                </button>
              </div>

              <button
                class="border border-gray-200 rounded-full h-[30px] flex items-center space-x-4 w-full py-1 px-2 hover:text-indigo-800 duration-200 hover:border-indigo-400"
                @click="handleAddFilter"
              >
                <i class="fa-solid fa-plus"></i>
                <span class="text-gray-500"> Add filter... </span>
              </button>
              <div class="flex items-center">
                <button
                  class="border border-emerald-600 bg-emerald-500 rounded-l-full h-[30px] flex items-center space-x-4 py-1 px-2 text-gray-100 w-1/2 hover:bg-emerald-900 duration-200"
                  @click="handleApplyFilter"
                >
                  <i class="fa-solid fa-check"></i>
                  <span class="text-gray-50"> Áp dụng filter </span>
                </button>
                <button
                  class="border border-amber-600 bg-amber-500 rounded-r-full h-[30px] flex items-center space-x-4 py-1 px-2 text-gray-100 w-1/2 hover:bg-amber-800 duration-200"
                  @click="handleUnReviewFilter"
                >
                  <i class="fa-solid fa-x"></i>
                  <span class="text-gray-50"> Xoá filter </span>
                </button>
              </div>
              <button
                class="border border-red-600 bg-red-500 rounded-full h-[30px] flex items-center justify-center space-x-2 py-1 px-2 text-gray-100 w-full hover:bg-red-800 duration-200"
                @click.stop="isSearching = false"
              >
                <i class="fa-solid fa-x"></i>
                <span class="text-gray-50"> Đóng </span>
              </button>
            </div>
          </div>
        </div>
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
          class="h-[40px] aspect-1 bg-emerald-700 flex items-center justify-center text-gray-50 rounded-full duration-200 hover:bg-emerald-800"
          v-if="$roleCheck('POST', route.params.post as string)"
        >
          <i class="fa-solid fa-plus"></i>
        </NuxtLink>
      </div>
    </div>

    <div
      class="max-h-[85%] overflow-y-scroll hidden-scrollbar space-y-[1px] rounded-b-[10px] rounded-t-[10px]"
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
        :key="item.id"
        :schema="schema"
        :sortBy="sortBy"
        :item="item"
        :width="width"
      />
    </div>

    <div
      class="flex items-center justify-between w-full max-md:flex-wrap max-md:space-y-4"
      :class="{
        '!justify-end': totalPages === 1,
      }"
    >
      <div
        class="flex space-x-2 items-center text-[14px]"
        v-if="totalPages > 1"
      >
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
            disabled: currentPage === 1,
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
            disabled: currentPage === totalPages,
          }"
        >
          <i class="fa-solid fa-chevron-right"></i>
        </NuxtLink>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <Modal v-model="modalFilter">
      <div
        class="w-full top-0 left-0 max-h-fit rounded-[15px] overflow-hidden duration-200 bg-gray-50 border border-gray-300 mx-2"
        :class="{
          'py-2': Object.keys(searchObject).length > 0,
        }"
      >
        <Search
          :searchObject
          :deep="0"
          :type="'object'"
          :schema
          @updateSearchObject="updateSearchObject"
        />
        <div class="p-1 space-y-2">
          <div
            v-for="(item, index) in filterArr"
            :key="index"
            class="flex space-x-2 items-center"
          >
            <span class="text-gray-400">filter</span>
            <input
              type="text"
              class="rounded-full border border-gray-200 outline-none w-full py-1 px-2 text-indigo-500 !ml-1"
              v-model="filterArr[index]"
            />
            <button
              class="border border-gray-200 rounded-full flex-shrink-0 h-[30px] aspect-1 hover:text-red-500 hover:border-red-500 duration-200"
              @click.stop="handleRemoveFilter(index)"
            >
              <i class="fa-solid fa-minus"></i>
            </button>
          </div>

          <button
            class="border border-gray-200 rounded-full h-[30px] flex items-center space-x-4 w-full py-1 px-2 hover:text-indigo-800 duration-200 hover:border-indigo-400"
            @click="handleAddFilter"
          >
            <i class="fa-solid fa-plus"></i>
            <span class="text-gray-500"> Add filter... </span>
          </button>
          <div class="flex items-center">
            <button
              class="border border-emerald-600 bg-emerald-500 rounded-l-full h-[30px] flex items-center space-x-4 py-1 px-2 text-gray-100 w-1/2 hover:bg-emerald-900 duration-200"
              @click="handleApplyFilter"
            >
              <i class="fa-solid fa-check"></i>
              <span class="text-gray-50"> Áp dụng filter </span>
            </button>
            <button
              class="border border-amber-600 bg-amber-500 rounded-r-full h-[30px] flex items-center space-x-4 py-1 px-2 text-gray-100 w-1/2 hover:bg-amber-800 duration-200"
              @click="handleUnReviewFilter"
            >
              <i class="fa-solid fa-x"></i>
              <span class="text-gray-50"> Xoá filter </span>
            </button>
          </div>
          <button
            class="border border-red-600 bg-red-500 rounded-full h-[30px] flex items-center justify-center space-x-2 py-1 px-2 text-gray-100 w-full hover:bg-red-800 duration-200"
            @click.stop="modalFilter = false"
          >
            <i class="fa-solid fa-x"></i>
            <span class="text-gray-50"> Đóng </span>
          </button>
        </div>
      </div>
    </Modal>
  </Teleport>
</template>
<script setup lang="ts">
import qs from "qs";
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
const { loading, screenWidth } = useGetState();
const data = ref<any>(null);
const schema = useState<any>(schemaApi);
const sortBy = ref<string>((route.query.sort as string) || "-id");
const width = ref<{
  [key: string]: number;
}>({});
const { $getMaxLength } = useNuxtApp();
const searchObject = useState<any>("searchObject", () => ({}));
const isSearching = ref(false);
const filterArr = ref<string[]>([""]);
const filtering = ref(false);
const modalFilter = ref(false);

const isFiltering = computed(() => {
  if (
    Object.keys(searchObject).length > 0 &&
    filtering.value === true &&
    filterArr.value.every((filter) => filter !== "")
  ) {
    return true;
  }
  return false;
});

async function getList() {
  const params: any = {
    limit: perPage,
    page:
      filterArr.value.length > 0 && filterArr.value.every((x) => x !== "")
        ? 1
        : currentPage.value,
    meta: "*",
    sort: sortBy.value,
  };
  if (filterArr.value.length > 0 && filterArr.value.every((x) => x !== "")) {
    for (const filter of filterArr.value) {
      const filterSplit = filter.split("=");
      const filterKey = `filter${filterSplit[0]}`;
      params[filterKey] = filterSplit[1];
    }
    filtering.value = true;
  } else {
    filtering.value = false;
  }
  const result: any = await useApi(dataApi, { params });
  totalPages.value = Math.ceil(
    (filterArr.value.length > 0 && filterArr.value.every((x) => x !== "")
      ? result.meta.filterCount
      : result.meta.totalCount) / perPage
  );
  data.value = result.data;
}

async function getSchema() {
  if (schema.value) return;
  const result: any = await useApi(schemaApi);
  schema.value = result.data;
}

function handleAddFilter() {
  filterArr.value.push("");
}

function handleRemoveFilter(index: number) {
  filterArr.value = filterArr.value.filter((item, idx) => idx !== index);
}

function updateSearchObject(data: any) {
  searchObject.value = data;
}

watchEffect(() => {
  handleReviewFilter();
});

function handleReviewFilter() {
  let totalString = "";
  for (const item of filterArr.value) {
    totalString += "&" + item;
  }
  searchObject.value = qs.parse(totalString, { depth: 10 });
}

async function handleApplyFilter() {
  loading.value = true;
  await getList();
  currentPage.value = 1;
  loading.value = false;
  if (screenWidth.value < 768) modalFilter.value = false;
  else isSearching.value = false;
}

async function handleUnReviewFilter() {
  searchObject.value = {};
  filterArr.value = [];
}

async function handleUnApplyFilter() {
  handleUnReviewFilter();
  loading.value = true;
  await getList();
  currentPage.value = 1;
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
  if (!sortBy.value) sortBy.value = "-id";
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

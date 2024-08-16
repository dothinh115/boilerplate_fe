<template>
  <div class="h-full flex-col max-h-full space-y-4">
    <div class="flex justify-between flex-wrap-reverse self-start">
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
        <div class="text-[25px] text-gray-200" v-else>
          {{ "/" + route.params.post }}
        </div>
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
    <DynamicList
      :data
      :schema
      :totalPages
      v-model:currentPage="currentPage"
      :pagination
      :sortBy
      @sort="handleSort"
    />
  </div>
  <Teleport to="body">
    <Modal v-model="modalFilter">
      <div
        class="w-[95%] top-0 left-0 max-h-fit rounded-[15px] overflow-hidden duration-200 bg-gray-50 border border-gray-300"
        :class="{
          'py-2': Object.keys(searchObject).length > 0,
        }"
      >
        <Search
          :searchObject
          :deep="0"
          :type="'object'"
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
  <NuxtPage />
</template>
<script setup lang="ts">
import qs from "qs";
const route = useRoute();
const dataApi = `/${route.params.post}`;
const schemaApi = `/schema/${route.params.post}`;
const filterArr = ref<string[]>([""]);
const perPage = 20;
const currentPage = ref(Number(route.query.page) || 1);
const sortBy = ref<string>((route.query.sort as string) || "-createdAt,-id");
const filtering = ref(false);
const data = ref<any>(null);
const totalPages = ref(0);
const schema = useState<any>(schemaApi);
const { loading, screenWidth, shouldRevalidate } = useGetState();
const searchObject = useState<any>("searchObject", () => ({}));
const modalFilter = ref(false);
const isSearching = ref(false);
const pagination = ref<(string | number)[]>([]);
const router = useRouter();

async function getList() {
  const params: any = {
    limit: perPage,
    page: currentPage.value,
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
  schema.value = result;
}

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

async function handleRevalidate() {
  loading.value = true;
  await getList();
  loading.value = false;
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
  await handleRevalidate();
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
  await handleRevalidate();
  currentPage.value = 1;
  loading.value = false;
}

function handleAddFilter() {
  filterArr.value.push("");
}

function handleRemoveFilter(index: number) {
  filterArr.value = filterArr.value.filter((item, idx) => idx !== index);
}

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

watch(filterArr, ([newVal, oldVal]) => {
  if (newVal && newVal.length !== oldVal.length) {
    currentPage.value = 1;
  }
});

watch(
  () => route.query.page,
  async (newValue) => {
    currentPage.value = Number(newValue);
    if (!route.query.page) currentPage.value = 1;
    loading.value = true;
    await handleRevalidate();
    loading.value = false;
  }
);

watch(
  () => route.query.sort,
  async (newVal) => {
    if (newVal) {
      sortBy.value = newVal as string;
      loading.value = true;
      await handleRevalidate();
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

//watch route để xem khi nào cần revalidate dữ liệu,
// onBeforeRouteUpdate(async (to, from) => {
//   if (
//     from.name?.toString().includes(to.name?.toString() as string) &&
//     from.name !== to.name
//   ) {
//     await handleRevalidate();
//   }
// });

watch(shouldRevalidate, async (newVal) => {
  if (newVal) {
    await handleRevalidate();
    shouldRevalidate.value = false;
  }
});

async function fetchAll() {
  loading.value = true;
  await getSchema();
  await getList();
  loading.value = false;
}

function updateSearchObject(data: any) {
  searchObject.value = data;
}

await fetchAll();
</script>

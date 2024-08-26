<template>
  <div
    class="flex flex-col justify-between h-dvh bg-gray-100 lg:w-[40%] md:w-[60%] w-[calc(100%-61px)] max-h-dvh ml-auto relative shadow-lg rounded-l-lg"
  >
    <!-- Button group -->
    <div
      class="absolute -translate-x-full top-0 md:pr-3 pr-2 pt-2 flex flex-col space-y-4"
    >
      <button
        class="h-[50px] aspect-1 rounded-full flex items-center justify-center bg-red-600 text-white text-[20px] lg:hover:bg-gray-50 lg:hover:text-red-600 duration-200 shadow-md"
        @click="handleCancel"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
      <button
        class="h-[50px] aspect-1 rounded-full flex items-center justify-center bg-teal-500 text-white text-[20px] lg:hover:bg-teal-600 duration-200 shadow-md"
        @click="handleConfirm"
      >
        <i class="fa-solid fa-check"></i>
      </button>
      <button
        class="h-[50px] aspect-1 rounded-full flex items-center justify-center bg-sky-500 text-white text-[20px] lg:hover:bg-sky-600 duration-200 shadow-md"
        @click="handleSearch()"
      >
        <i class="fa-solid fa-magnifying-glass"></i>
      </button>
      <button
        class="h-[50px] aspect-1 rounded-full flex items-center justify-center bg-red-500 text-white text-[20px] lg:hover:bg-red-600 duration-200 shadow-md"
        @click="handleCancelSearch()"
        v-if="isFiltering"
      >
        <i class="fa-solid fa-magnifying-glass-minus"></i>
      </button>
    </div>

    <!-- Content -->
    <div class="max-h-dvh overflow-auto h-full hidden-scrollbar rounded-l-lg">
      <div class="min-w-full relative">
        <div
          class="flex border-b-2 border-gray-300 text-[16px] py-3 bg-indigo-600 text-gray-50 items-center w-max min-w-full sticky top-0 shadow-md"
        >
          <div class="min-w-[50px]"></div>
          <DynamicSelectListItem :schema="schema" :width="width" />
        </div>
        <div class="h-full">
          <DynamicSelectListItem
            v-for="item in data"
            :key="data.id"
            :schema="schema"
            :data="item"
            :selectedArr="selectedArr"
            :width="width"
            @handleSelect="handleSelect"
          />
          <div
            class="flex space-x-3 px-2 py-2 items-center text-[15px] text-gray-600"
            v-if="data.length === 0"
          >
            Chưa có record nào!
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination and Selected Info -->
    <!-- <div
      class="flex space-x-2 items-center text-[14px] p-4 w-full flex-wrap [&>a]:max-md:mb-2"
    >
      <button
        @click="currentPage !== 1 && (currentPage -= 1)"
        class="paginate"
        :class="{
          'opacity-50 cursor-not-allowed': currentPage === 1,
        }"
      >
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <button
        v-for="(item, index) in pagination"
        :key="index"
        @click="typeof item === 'number' && (currentPage = Number(item))"
        :class="{
          '!bg-indigo-600 bg-opacity-90 !text-white': item === currentPage,
          paginate: typeof item === 'number',
          'text-gray-800': typeof item !== 'number',
        }"
        class="py-1 px-3 rounded-full hover:bg-indigo-500 hover:text-white transition duration-200"
      >
        {{ item }}
      </button>
      <button
        @click="currentPage !== totalPages && (currentPage += 1)"
        class="paginate"
        :class="{
          'opacity-50 cursor-not-allowed': currentPage === totalPages,
        }"
      >
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div> -->
    <div class="p-2">
      <Paginate
        :totalPages
        :pagination
        v-model:currentPage="currentPage"
        :link="false"
      />
    </div>

    <div class="bg-indigo-600 text-white p-4 text-center rounded-b-lg">
      Đã chọn:
      {{
        Array.isArray(selectedArr)
          ? selectedArr.map((item) => item.id).join(", ")
          : selectedArr?.id
      }}
    </div>
  </div>

  <!-- Modal -->
  <Teleport to="body">
    <Modal v-model="modalFilter">
      <div
        class="xl:w-[35%] lg:w-1/2 md:w-[60%] w-[95%] top-0 left-0 max-h-fit rounded-lg overflow-hidden bg-white shadow-xl border border-gray-300 mx-2"
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
        <div class="p-4 space-y-4">
          <div
            v-for="(item, index) in filterArr"
            :key="index"
            class="flex space-x-2 items-center"
          >
            <span class="text-gray-400">Filter</span>
            <input
              type="text"
              class="rounded-full border border-gray-300 outline-none w-full py-1 px-4 text-indigo-600"
              v-model="filterArr[index]"
            />
            <button
              class="border border-gray-300 rounded-full h-[30px] aspect-1 hover:text-red-500 hover:border-red-500 duration-200"
              @click.stop="handleRemoveFilter(index)"
            >
              <i class="fa-solid fa-minus"></i>
            </button>
          </div>

          <button
            class="border border-gray-300 rounded-full h-[40px] flex items-center justify-center space-x-4 w-full py-2 px-4 hover:bg-indigo-500 hover:text-white transition duration-200"
            @click="handleAddFilter"
          >
            <i class="fa-solid fa-plus"></i>
            <span class="text-gray-500">Thêm filter...</span>
          </button>
          <div class="flex items-center space-x-2">
            <button
              class="border border-emerald-600 bg-emerald-500 rounded-l-full h-[40px] flex items-center justify-center space-x-4 w-full py-2 text-white hover:bg-emerald-600 transition duration-200"
              @click="handleApplyFilter"
            >
              <i class="fa-solid fa-check"></i>
              <span>Áp dụng</span>
            </button>
            <button
              class="border border-amber-600 bg-amber-500 rounded-r-full h-[40px] flex items-center justify-center space-x-4 w-full py-2 text-white hover:bg-amber-600 transition duration-200"
              @click="handleUnReviewFilter"
            >
              <i class="fa-solid fa-x"></i>
              <span>Xóa</span>
            </button>
          </div>
          <button
            class="border border-red-600 bg-red-500 rounded-full h-[40px] flex items-center justify-center space-x-2 py-2 text-white w-full hover:bg-red-600 transition duration-200"
            @click.stop="modalFilter = false"
          >
            <i class="fa-solid fa-x"></i>
            <span>Đóng</span>
          </button>
        </div>
      </div>
    </Modal>
  </Teleport>
</template>

<script setup lang="ts">
import qs from "qs";

type TProps = {
  relationData: {
    relation: string;
    type: "string" | "number" | "array" | undefined;
    defaultValue: string | number | string[] | number[];
    key: string;
  };
};
const props = defineProps<TProps>();
const emits = defineEmits(["close", "confirm"]);
const data = ref<any>([]);
const api = `/${props.relationData.relation}`;
const schemaApi = `/schema/${props.relationData.relation}`;
const schema = useState<any>(schemaApi);
const { screenWidth } = useGetState();
const { startLoading, finishLoading } = useLoading();
const currentPage = ref(1);
const perPage = 20;
const totalPages = ref(0);
const pagination = ref<(string | number)[]>([]);
const modalFilter = ref(false);
const searchObject = useState<any>("searchObject", () => ({}));
const filterArr = ref<string[]>([]);
const selectedArr = ref<any[] | any>([]);
const width = ref<{
  [key: string]: number;
}>({});
const { $getMaxLength, $widthCalc } = useNuxtApp();
const filtering = ref(false);

if (props.relationData.defaultValue) {
  filterArr.value = [
    `[id][${props.relationData.type === "array" ? "_in" : "_eq"}]=${
      props.relationData.defaultValue
    }`,
  ];
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

function handleSelect(item: any) {
  if (props.relationData.type === "array") {
    if (selectedArr.value.map((x: any) => x.id).includes(item.id)) {
      selectedArr.value = selectedArr.value.filter(
        (z: any) => z.id !== item.id
      );
    } else selectedArr.value.push({ id: item.id });
  } else {
    if (item.id === selectedArr.value.id) {
      selectedArr.value = {};
    } else {
      selectedArr.value.id = item.id;
    }
  }
}

if (props.relationData.type === "array") {
  if (Array.isArray(props.relationData.defaultValue)) {
    selectedArr.value = (
      props.relationData.defaultValue as Array<string | number>
    ).map((x) => ({ id: x }));
  }
} else {
  selectedArr.value = { id: props.relationData.defaultValue };
}

watch(
  () => currentPage.value,
  async () => {
    await getData();
  }
);
async function getData() {
  const params: any = {
    meta: "*",
    limit: perPage,
    page: currentPage.value,
    sort: "-id",
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
  const result: any = await useApi(api, { params });
  data.value = result.data;
  totalPages.value = Math.ceil(result.meta.filterCount / perPage);
}

async function getSchema() {
  if (schema.value) return;
  const result: any = await useApi(schemaApi);
  schema.value = result;
}

async function fetchAll() {
  startLoading();
  await getSchema();
  await getData();
  finishLoading();
}

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

function handleCancel() {
  emits("close");
}

function handleConfirm() {
  emits("confirm", {
    selected: selectedArr.value,
    key: props.relationData.key,
  });
  emits("close");
}

function updateSearchObject(data: any) {
  searchObject.value = data;
}

function handleRemoveFilter(index: number) {
  filterArr.value = filterArr.value.filter((item, idx) => idx !== index);
}

function handleAddFilter() {
  filterArr.value.push("");
}

async function handleApplyFilter() {
  startLoading();
  await getData();
  currentPage.value = 1;
  finishLoading();
  modalFilter.value = false;
}

async function handleUnReviewFilter() {
  searchObject.value = {};
  filterArr.value = [];
}

function handleSearch() {
  modalFilter.value = true;
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

async function handleCancelSearch() {
  filterArr.value = [];
  startLoading();
  await getData();
  finishLoading();
}

await fetchAll();
watchEffect(() => {
  width.value = $widthCalc(
    $getMaxLength({ schema: schema.value, data: data.value })
  );
});
</script>

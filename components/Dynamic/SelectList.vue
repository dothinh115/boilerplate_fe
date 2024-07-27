<template>
  <div
    class="flex flex-col justify-between h-dvh bg-gray-50 lg:w-[40%] md:w-[60%] w-[calc(100%-61px)] max-h-dvh ml-auto relative"
  >
    <div class="absolute -translate-x-full top-0 p-2 flex flex-col space-y-4">
      <button
        class="h-[45px] aspect-1 rounded-full text-gray-50 flex items-center justify-center bg-red-500 bg-opacity-90 text-[20px] lg:hover:bg-gray-50 lg:hover:text-red-600 duration-200"
        @click="handleCancel"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
      <button
        class="p-2 rounded-full text-teal-600 h-[45px] aspect-1 flex items-center justify-center bg-gray-100 text-[20px] lg:hover:bg-teal-600 lg:hover:text-white duration-200"
        @click="handleConfirm"
      >
        <i class="fa-solid fa-check"></i>
      </button>
      <button
        class="h-[45px] aspect-1 rounded-full text-gray-50 flex items-center justify-center bg-sky-500 bg-opacity-90 text-[20px] lg:hover:bg-sky-900 lg:hover:text-gray-50 duration-200"
        @click="handleSearch()"
      >
        <i class="fa-solid fa-magnifying-glass"></i>
      </button>
      <button
        class="h-[45px] aspect-1 rounded-full text-gray-50 flex items-center justify-center bg-red-500 bg-opacity-90 text-[20px] lg:hover:bg-white lg:hover:text-red-500 duration-200"
        @click="handleCancelSearch()"
        v-if="isFiltering"
      >
        <i class="fa-solid fa-magnifying-glass-minus"></i>
      </button>
    </div>
    <div class="max-h-dvh overflow-auto h-full hidden-scrollbar">
      <div class="min-w-full !mt-0 relative">
        <div
          class="flex border-gray-200 space-x-3 border-b text-[16px] py-2 bg-indigo-600 text-gray-50 items-center w-max min-w-full sticky top-0"
        >
          <div class="min-w-[50px] h-[10px]"></div>
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
            class="flex space-x-3 px-2 py-2 items-center text-[15px] min-w-max"
            v-if="data.length === 0"
          >
            Chưa có record nào!
          </div>
        </div>
      </div>
    </div>
    <div>
      <div
        class="flex space-x-2 items-center text-[14px] p-2 w-full flex-wrap [&>a]:max-md:mb-2"
      >
        <button
          @click="currentPage !== 1 && (currentPage -= 1)"
          class="paginate"
          :class="{
            disabled: currentPage === 1,
          }"
        >
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <button
          v-for="(item, index) in pagination"
          :key="index"
          @click="typeof item === 'number' && (currentPage = Number(item))"
          :class="{
            '!bg-indigo-600 bg-opacity-90 !text-gray-100': item === currentPage,
            paginate: typeof item === 'number',
            'text-gray-800': typeof item !== 'number',
          }"
        >
          {{ item }}
        </button>
        <button
          @click="currentPage !== totalPages && (currentPage += 1)"
          class="paginate"
          :class="{
            disabled: currentPage === totalPages,
          }"
        >
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
      <div class="bg-indigo-600 text-gray-50 p-2">
        Đã chọn:
        {{
          Array.isArray(selectedArr)
            ? selectedArr.map((item: any) => item.id)
            : selectedArr?.id
        }}
      </div>
    </div>
  </div>
  <Teleport to="body">
    <Modal v-model="modalFilter">
      <div
        class="xl:w-[35%] lg:w-1/2 md:w-[60%] w-[95%] top-0 left-0 max-h-fit rounded-[15px] overflow-hidden duration-200 bg-gray-50 border border-gray-300 mx-2"
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
const { loading, screenWidth } = useGetState();
const currentPage = ref(1);
const perPage = 20;
const totalPages = ref(0);
const pagination = ref<(string | number)[]>([]);
const modalFilter = ref(false);
const searchObject = useState<any>("searchObject", () => ({}));
const filterArr = ref<string[]>([
  `[id][${props.relationData.type === "array" ? "_in" : "_eq"}]=${
    props.relationData.defaultValue
  }`,
]);
const selectedArr = ref<any[] | any>([]);
const width = ref<{
  [key: string]: number;
}>({});
const { $getMaxLength, $widthCalc } = useNuxtApp();
const filtering = ref(false);

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
  totalPages.value = Math.ceil(
    (result.meta.totalCount || result.meta.filterCount) / perPage
  );
}

async function getSchema() {
  if (schema.value) return;
  const result: any = await useApi(schemaApi);
  schema.value = result;
}

async function fetchAll() {
  loading.value = true;
  await getSchema();
  await getData();
  loading.value = false;
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
  loading.value = true;
  await getData();
  currentPage.value = 1;
  loading.value = false;
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
  loading.value = true;
  await getData();
  loading.value = false;
}

await fetchAll();
width.value = $widthCalc(
  $getMaxLength({ schema: schema.value, data: data.value })
);
</script>

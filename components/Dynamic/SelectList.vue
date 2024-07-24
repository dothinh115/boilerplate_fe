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
        v-if="isSearching"
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
      <div class="flex space-x-2 items-center text-[14px] p-2">
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
    <Modal v-model="searchModal">
      <Search
        :schema="schema"
        :small="true"
        @close="searchModal = false"
        @searchConfirm="handleSearchConfirm"
        :searching="searchData"
      />
    </Modal>
  </Teleport>
</template>
<script setup lang="ts">
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
const data = ref<any>({});
const api = `/${props.relationData.relation}`;
const schemaApi = `/schema/${props.relationData.relation}`;
const schema = useState<any>(schemaApi);
const { loading, screenWidth } = useGetState();
const currentPage = ref(1);
const perPage = 20;
const totalPages = ref(0);
const pagination = ref<(string | number)[]>([]);
const searchModal = ref(false);
const { $typeCheck } = useNuxtApp();
const searchData = ref({
  field: props.relationData.defaultValue ? "id" : "",
  searchKey:
    $typeCheck(props.relationData.defaultValue) === "array" ? "_in" : "_eq",
  searchValue:
    $typeCheck(props.relationData.defaultValue) === "array"
      ? Array(props.relationData.defaultValue).join(",")
      : (props.relationData.defaultValue as string),
});

const selectedArr = ref<any[] | any>([]);
const width = ref<{
  [key: string]: number;
}>({});
const { $getMaxLength, $widthCalc } = useNuxtApp();

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

const isSearching = computed(
  () =>
    searchData.value.field &&
    searchData.value.searchKey &&
    searchData.value.searchValue
);

async function getData() {
  const params = {
    meta: "*",
    limit: perPage,
    page: currentPage.value,
    sort: "-id",
    ...(isSearching.value && {
      [`filter[${searchData.value.field}][${searchData.value.searchKey}]`]:
        searchData.value.searchKey === "_in" ||
        searchData.value.searchKey === "_nin"
          ? `[${searchData.value.searchValue}]`
          : searchData.value.searchValue,
    }),
  };
  const result: any = await useApi(api, { params });
  data.value = result.data;
  totalPages.value = Math.ceil(
    (result.meta.totalCount || result.meta.filterCount) / perPage
  );
}

async function getSchema() {
  if (schema.value) return;
  const result: any = await useApi(schemaApi);
  schema.value = result.data;
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

function handleSearch() {
  searchModal.value = true;
}

async function handleSearchConfirm(data: {
  field: string;
  searchKey: string;
  searchValue: string;
}) {
  searchData.value = data;
  await getData();
  loading.value = false;
  searchModal.value = false;
}

async function handleCancelSearch() {
  searchData.value = {
    field: "",
    searchKey: "",
    searchValue: "",
  };
  loading.value = true;
  await getData();
  loading.value = false;
}

await fetchAll();
width.value = $widthCalc(
  $getMaxLength({ schema: schema.value, data: data.value })
);
</script>

<template>
  <Teleport to="body">
    <Modal v-model="modalValue">
      <div
        class="flex flex-col space-y-4 h-full bg-gray-50 w-[40%] fixed right-0 top-0"
      >
        <div
          class="flex items-center space-x-3 py-2 pl-5 text-[25px] bg-indigo-600"
        >
          <button
            class="h-[35px] aspect-1 rounded-full text-red-600 flex items-center justify-center bg-gray-50"
            @click="cancel"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
          <button
            class="p-2 rounded-full text-teal-600 h-[35px] aspect-1 flex items-center justify-center bg-gray-50"
            @click="confirm"
          >
            <i class="fa-solid fa-check"></i>
          </button>
        </div>
        <div class="min-w-full overflow-x-scroll !mt-0 hidden-scrollbar">
          <div
            class="flex space-x-2 border-gray-200 border-b text-[16px] px-2 py-4 bg-indigo-400 text-gray-50 items-center w-max min-w-full"
          >
            <div class="min-w-[50px]"></div>
            <div class="flex space-x-3">
              <div
                v-for="(key, index) in Object.keys(schema)"
                :key="index"
                :class="{
                  'w-[50px]': key === '_id',
                  'w-[200px]':
                    schema[key].input === 'text' ||
                    schema[key].input === 'richText',
                  'w-[100px]':
                    schema[key].input === 'number' ||
                    schema[key].input === 'array',
                }"
              >
                {{ key }}
              </div>
            </div>
          </div>
          <div>
            <div
              class="flex space-x-3 odd:bg-gray-100 px-2 py-2 items-center text-[15px] w-max min-w-full"
              v-for="item in data"
              :key="item._id"
            >
              <div class="flex justify-center items-center min-w-[50px]">
                <button @click="handleSelect(item)" class="flex items-center">
                  <i
                    class="text-[24px]"
                    :class="{
                      'fa-regular fa-circle text-indigo-900': Array.isArray(selectedArr) ? !selectedArr
                        .map((x:any) => x._id)
                        .includes(item._id) : selectedArr?._id !== item._id,
                      'fa-solid fa-circle-check text-indigo-800': Array.isArray(selectedArr) ? selectedArr
                        .map((x:any) => x._id)
                        .includes(item._id) : selectedArr?._id === item._id,
                    }"
                  ></i>
                </button>
              </div>
              <div
                v-for="(key, index) in Object.keys(schema)"
                :key="index"
                :class="{
                  'w-[50px]': key === '_id',
                  'w-[200px]':
                    schema[key].input === 'text' ||
                    schema[key].input === 'richText',
                  'w-[100px]':
                    schema[key].input === 'number' ||
                    schema[key].input === 'array',
                }"
                class="truncate flex-shrink-0"
              >
                {{ item[key] }}
              </div>
            </div>
          </div>
        </div>
        <div class="flex space-x-2 items-center text-[14px] p-2">
          <button
            @click="currentPage !== 1 && (currentPage -= 1)"
            class="bg-indigo-200 p-1 rounded-[10px] min-w-[35px] flex justify-center border border-indigo-100 h-[35px] items-center text-gray-800 hover:bg-indigo-600 hover:text-gray-100 duration-200"
            :class="{
              'opacity-50': currentPage === 1,
            }"
          >
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <button
            v-for="(item, index) in pagination"
            :key="index"
            @click="typeof item === 'number' && (currentPage = Number(item))"
            :class="{
              'bg-indigo-600 bg-opacity-90 text-gray-100': item === currentPage,
              'bg-indigo-200 p-1 rounded-[10px] min-w-[35px] h-[35px] flex justify-center border items-center hover:bg-indigo-600 hover:text-gray-100 duration-200':
                typeof item === 'number',
              'text-gray-800': typeof item !== 'number',
            }"
          >
            {{ item }}
          </button>
          <button
            @click="currentPage !== totalPages && (currentPage += 1)"
            class="bg-indigo-200 p-1 rounded-[10px] min-w-[35px] flex justify-center border border-indigo-400 h-[35px] items-center text-gray-800 hover:bg-indigo-600 hover:text-gray-100 duration-200"
            :class="{
              'opacity-50': currentPage === totalPages,
            }"
          >
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
        <div class="bg-indigo-600 text-gray-50 p-2">
          Đã chọn:
          {{
            Array.isArray(selectedArr)
              ? selectedArr.map((item: any) => item._id)
              : selectedArr?._id
          }}
        </div>
      </div>
    </Modal>
  </Teleport>
</template>
<script setup lang="ts">
type TProps = {
  refData: {
    ref: string;
    type: "text" | "number" | "array";
    defaultValue: string | number | string[] | number[];
    key: string;
  };
};
const props = defineProps<TProps>();
const emits = defineEmits(["close", "confirm"]);
const route = useRoute();
const modalValue = ref(true);
const data = ref<any>({});
const schema = ref<any>({});
const api = `/${route.params.pre}/${props.refData.ref}`;
const schemaApi = `/schema/${props.refData.ref}`;
const loading = useState("loading");
const currentPage = ref(1);
const perPage = 20;
const totalPages = ref(0);
const pagination = ref<(string | number)[]>([]);
const selectedArr = ref<any[] | any>([]);

function handleSelect(item: any) {
  if (props.refData.type === "array") {
    if (selectedArr.value.map((x: any) => x._id).includes(item._id)) {
      selectedArr.value = selectedArr.value.filter(
        (z: any) => z._id !== item._id
      );
    } else selectedArr.value.push({ _id: item._id });
  } else {
    if (item._id === selectedArr.value._id) {
      selectedArr.value = {};
    } else {
      selectedArr.value._id = item._id;
    }
  }
}

if (props.refData.type === "array") {
  if (Array.isArray(props.refData.defaultValue)) {
    selectedArr.value = (
      props.refData.defaultValue as Array<string | number>
    ).map((x) => ({ _id: x }));
  }
} else {
  selectedArr.value = { _id: props.refData.defaultValue };
}

watch(
  () => modalValue.value,
  (newValue) => {
    if (!newValue) emits("close");
  }
);

watch(
  () => currentPage.value,
  async (newValue) => {
    await getData();
    usePaginate(
      {
        totalPages: totalPages.value,
        currentPage: newValue,
        range: 2,
      },
      (paginate: (string | number)[]) => {
        pagination.value = paginate;
      }
    );
  }
);

async function getData() {
  const params = {
    meta: "*",
    limit: perPage,
    page: currentPage.value,
  };
  const result: any = await useApi(api, { params });
  data.value = result.data;
  totalPages.value = Math.ceil(
    (result.meta.total_count || result.meta.filter_count) / perPage
  );
}

async function getSchema() {
  const result: any = await useApi(schemaApi);
  schema.value = result.data;
}

async function fetchAll() {
  const promises = [getSchema(), getData()];
  loading.value = true;
  await Promise.all(promises);
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

function cancel() {
  emits("close");
}

function confirm() {
  emits("confirm", { selected: selectedArr.value, key: props.refData.key });
  emits("close");
}

await fetchAll();
</script>

<template>
  <div
    v-if="type === 'object' && Object.keys(searchObject).length > 0"
    class="flex items-center justify-between text-indigo-800 w-full h-[45px] px-2"
    :class="{
      'bg-gray-50': Object.keys(searchObject).length > 0,
    }"
  >
    <div class="relative ml-2 flex items-center space-x-1 h-full">
      <div
        class="h-full border-l border-gray-200 relative after:absolute after:contents-['-'] after:h-[1px] after:w-full after:border-t after:border-gray-200 after:border-dashed after:top-1/2 after:-translate-y-1/2"
        :style="{ width: (deep + 1) * 12 + 'px' }"
      ></div>
      <i class="fa-solid fa-grip-vertical"></i>
      <span
        class="rounded-[5px] p-1 min-w-[35px] bg-lime-200 flex justify-center items-center"
        :class="{
          '!bg-indigo-200': Object.keys(searchObject)[0] === 'and',
          '!bg-orange-200': Object.keys(searchObject)[0] === 'or',
        }"
      >
        {{ Object.keys(searchObject)[0] }}
      </span>

      <span
        class="rounded-[5px] p-1 min-w-[30px] flex justify-center items-center bg-red-200"
        v-if="
          localType === 'unknown' && searchObject[Object.keys(searchObject)[0]]
        "
      >
        {{ searchObject[Object.keys(searchObject)[0]] }}
      </span>
    </div>
  </div>
  <div v-if="localType === 'object' && Object.keys(searchObject).length > 0">
    <Search
      :searchObject="searchObject[Object.keys(searchObject)[0]]"
      :deep="deep + 1"
      :type="getType(searchObject[Object.keys(searchObject)[0]])"
    />
  </div>
  <div
    v-if="
      localType !== 'unknown' &&
      localType === 'array' &&
      Array.isArray(searchObject[Object.keys(searchObject)[0]])
    "
  >
    <Search
      v-for="(item, index) in searchObject[Object.keys(searchObject)[0]]"
      :key="index"
      :searchObject="item"
      :deep="deep + 1"
      :type="getType(item)"
    />
  </div>
</template>

<script setup lang="ts">
type TProps = {
  searchObject: any;
  deep: number;
  type: "array" | "object" | "unknown";
};
const emits = defineEmits(["updateSearchData"]);
const props = defineProps<TProps>();
const flag = ref(false); //cờ để xác định đã chọn key
const mainSearchObject = useState<any>("searchObject");

const localType = computed(() =>
  Array.isArray(props.searchObject[Object.keys(props.searchObject)[0]])
    ? "array"
    : typeof props.searchObject[Object.keys(props.searchObject)[0]] === "object"
    ? "object"
    : "unknown"
);

function getType(data: any) {
  return Array.isArray(data)
    ? "array"
    : typeof data === "object"
    ? "object"
    : "unknown";
}

function removeAttribute(mainObj: any = { ...mainSearchObject.value }) {
  if (typeof mainObj === "object") {
    for (const key in mainObj) {
      if (JSON.stringify(mainObj) === JSON.stringify(props.searchObject)) {
        delete mainObj[key];
      } else {
        removeAttribute(mainObj[key]);
      }
    }
  } else if (Array.isArray(mainObj)) {
    for (const item of mainObj) {
      removeAttribute(item);
    }
  }
  mainSearchObject.value = mainObj;
}
</script>

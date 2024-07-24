<template>
  <div
    class="flex space-x-3 items-center text-[15px]"
    :class="{
      'odd:bg-gray-100 py-2 w-max min-w-full': data,
    }"
  >
    <div class="flex justify-center items-center min-w-[50px]" v-if="data">
      <button @click="handleSelect(data)" class="flex items-center">
        <i
          class="text-[24px]"
          :class="{
                    'fa-regular fa-circle text-indigo-900': Array.isArray(selectedArr) ? !selectedArr
                      .map((x:any) => x.id)
                      .includes(data.id) : selectedArr?.id !== data.id,
                    'fa-solid fa-circle-check text-indigo-800': Array.isArray(selectedArr) ? selectedArr
                      .map((x:any) => x.id)
                      .includes(data.id) : selectedArr?.id === data.id,
                  }"
        ></i>
      </button>
    </div>
    <div
      v-for="(key, index) in Object.keys(schema)"
      :key="index"
      :style="{
        width: width[key] + 'px',
      }"
      class="truncate flex-shrink-0"
    >
      <span
        :class="{
          'p-1 text-gray-50 rounded-[7px]':
            data && $typeCheck(data[key]) === 'boolean',
          'bg-green-900': data && data[key] === true,
          'bg-red-500': data && data[key] === false,
        }"
      >
        {{ data ? data[key] : key }}
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
type TProps = {
  schema: any;
  data?: any;
  selectedArr?: any[] | any;
  width: {
    [key: string]: number;
  };
};
const props = defineProps<TProps>();
const emits = defineEmits(["handleSelect"]);
function handleSelect(item: any) {
  emits("handleSelect", item);
}
console.log(props.width);
</script>

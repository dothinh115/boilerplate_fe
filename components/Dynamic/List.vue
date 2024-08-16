<template>
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
    <div class="p-2 bg-gray-100" v-if="data.length === 0">
      Chưa có record nào ở đây...
    </div>
  </div>

  <Paginate v-model:currentPage="localCurrentPage" :totalPages :pagination />
</template>
<script setup lang="ts">
type TProps = {
  data: any[];
  schema: any;
  totalPages: number;
  currentPage: number;
  pagination: (number | string)[];
  sortBy: string;
};
const props = defineProps<TProps>();
const width = ref<{
  [key: string]: number;
}>({});
const { $getMaxLength } = useNuxtApp();
const emits = defineEmits(["sort", "update:currentPage"]);
const localCurrentPage = ref(props.currentPage);
watch(
  () => props.currentPage,
  (newVal) => {
    localCurrentPage.value = newVal;
  }
);

watch(localCurrentPage, (newVal) => {
  emits("update:currentPage", newVal);
});

function handleSort(key: string) {
  emits("sort", key);
}

watchEffect(() => {
  width.value = $getMaxLength({ schema: props.schema, data: props.data });
});
</script>

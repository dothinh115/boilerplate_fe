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
  </div>

  <div
    class="flex items-center justify-between w-full max-md:flex-wrap max-md:space-y-4"
    :class="{
      '!justify-end': totalPages === 1,
    }"
  >
    <div
      class="flex space-x-2 items-center text-[14px] w-full flex-wrap [&>a]:max-md:mb-2"
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
const route = useRoute();
const width = ref<{
  [key: string]: number;
}>({});
const { $getMaxLength } = useNuxtApp();
const emit = defineEmits(["revalidate", "sort"]);

onBeforeRouteUpdate(async (to, from) => {
  if (
    from.name?.toString().includes(to.name?.toString() as string) &&
    from.name !== to.name
  ) {
    emit("revalidate");
  }
});

function handleSort(key: string) {
  emit("sort", key);
}

width.value = $getMaxLength({ schema: props.schema, data: props.data });
</script>

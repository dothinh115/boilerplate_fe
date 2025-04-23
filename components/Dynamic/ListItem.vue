<template>
  <NuxtLink
    class="flex items-center space-x-4 duration-100 last:rounded-b-[10px] w-max min-w-full"
    :class="{
      'odd:bg-gray-50 even:bg-gray-200 lg:hover:bg-opacity-90 p-2': props.item,
    }"
    :to="
      props.item
        ? {
            name: 'route-post-id',
            params: {
              post: route.params.post,
              id: props.item.id,
            },
            query: route.query,
          }
        : undefined
    "
  >
    <InputCheckbox
      :class="'border-gray-500 bg-indigo-100 checked:bg-indigo-500 checked:border-gray-300'"
      @click.stop
      @change="handleSelect"
      :checked="
        selectList.length === props.itemList.length &&
        itemList.length > 0 &&
        !props.item
          ? true
          : props.item && selectList.includes(props.item.id)
          ? true
          : false
      "
      v-if="$roleCheck('DELETE', route.params.post as string)"
    />
    <template v-for="(field, index) in Object.keys(props.schema)" :key="index">
      <div
        :style="{
          width: width[field] + 'px',
        }"
        class="flex space-x-2 group cursor-pointer items-center"
      >
        <p class="truncate" v-if="item">
          <span
            :class="{
              'font-bold': $typeCheck(item[field]) === 'boolean',
              'text-red-600':
                $typeCheck(item[field]) === 'boolean' && item[field] === false,
              'text-green-900 ':
                $typeCheck(item[field]) === 'boolean' && item[field] === true,
            }"
          >
            {{
              field === "password"
                ? "********"
                : item[field] === 0
                ? item[field]
                : item[field] === false
                ? item[field]
                : item[field]
                ? item[field]
                : "null"
            }}
          </span>
        </p>
        <div
          v-else
          @click="handleSort(field)"
          class="flex items-center space-x-2 min-w-full"
        >
          <span> {{ field }} </span>
          <i
            class="fa-solid fa-caret-down hidden items-center group-lg:hover:inline-block"
            :class="{
              '!inline-block': sortBy === field || sortBy.slice(1) === field,
              'rotate-180': (sortBy as string).startsWith('-') && sortBy.slice(1) === field
            }"
          ></i>
        </div>
      </div>
    </template>
  </NuxtLink>
</template>
<script setup lang="ts">
type TProps = {
  schema: any;
  sortBy: string;
  item?: any;
  width: {
    [key: string]: number;
  };
  itemList: any[];
};
const route = useRoute();
const props = defineProps<TProps>();
const emits = defineEmits(["handleSort"]);
const selectList = useGetState().dynamicListSelectList;
const width = ref<{
  [key: string]: number;
}>({});
const { $widthCalc } = useNuxtApp();

function handleSort(field: string) {
  emits("handleSort", field);
}

function handleSelect(event: Event) {
  const target = event.target as HTMLInputElement;

  if (!props.item) {
    target.checked
      ? (selectList.value = props.itemList.map((x) => x.id))
      : (selectList.value = []);
  } else {
    target.checked
      ? (selectList.value = [...selectList.value, props.item.id])
      : (selectList.value = selectList.value.filter(
          (x) => x !== props.item.id
        ));
  }
}

watchEffect(() => {
  width.value = $widthCalc(props.width);
});
</script>

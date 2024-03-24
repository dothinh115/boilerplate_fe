<template>
  <NuxtLink
    class="flex items-center space-x-2 duration-100 last:rounded-b-[10px] w-max min-w-full"
    :class="{
      'odd:bg-gray-50 even:bg-gray-200 hover:bg-opacity-90 p-2 ': props.item,
    }"
    :to="
      props.item
        ? {
            name: 'route-pre-post-id',
            params: {
              ...(route.params.post
                ? {
                    pre: route.params.pre,
                    post: route.params.post,
                  }
                : {
                    pre: 'api',
                    post: route.params.pre,
                  }),
              id: props.item._id,
            },
            query: route.query,
          }
        : undefined
    "
  >
    <div
      :class="{
        'w-[50px]': field === '_id',
        'w-[300px]':
          (schema[field].input === 'text' ||
            schema[field].input === 'richText') &&
          field !== '_id',

        'w-[200px]':
          (schema[field].input === 'array' ||
            schema[field].input === 'password' ||
            schema[field].input === 'email') &&
          field !== '_id',
        'w-[100px]':
          schema[field].input === 'number' || schema[field].input === 'boolean',
      }"
      class="flex space-x-2 group cursor-pointer items-center"
      v-for="(field, index) in Object.keys(props.schema)"
      :key="index"
    >
      <p class="truncate" v-if="item">
        <span
          :class="{
            'p-1 rounded-[10px]': schema[field].input === 'boolean',
            'bg-red-400 text-gray-50':
              schema[field].input === 'boolean' && item[field] === false,
            'bg-green-900 text-gray-50':
              schema[field].input === 'boolean' && item[field] === true,
          }"
        >
          {{ field === "password" ? "********" : item[field] }}</span
        >
      </p>
      <div v-else @click="handleSort(field)" class="space-x-2 min-w-full">
        <span> {{ field }} </span>
        <i
          class="fa-solid fa-caret-down hidden items-center group-hover:inline-block"
          :class="{
              '!inline-block': sortBy === field || sortBy.slice(1) === field,
              'rotate-180': (sortBy as string).startsWith('-') && sortBy.slice(1) === field
            }"
        ></i>
      </div>
    </div>
  </NuxtLink>
</template>
<script setup lang="ts">
type TProps = {
  schema: any;
  sortBy: string;
  item?: any;
};
const route = useRoute();
const props = defineProps<TProps>();
const emits = defineEmits(["handleSort"]);
function handleSort(field: string) {
  emits("handleSort", field);
}
</script>

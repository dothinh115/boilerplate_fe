<template>
  <template v-if="totalPages > 1">
    <!-- using nuxtLink -->
    <div
      class="flex space-x-2 items-center text-[14px] w-full flex-wrap [&>a]:max-md:mb-2"
      v-if="link"
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
        class="paginate py-1 px-3 rounded-full transition duration-200"
        :class="{
          'opacity-50 cursor-not-allowed disabled': currentPage === 1,
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
          '!bg-indigo-600 !bg-opacity-90 !text-white': item === currentPage,
          'paginate ': typeof item === 'number',
          'text-gray-800': typeof item !== 'number',
          '!text-gray-100 !lg:hover:none !px-1': item === '...',
        }"
        class="py-1 px-3 rounded-full lg:hover:text-white transition duration-200"
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
        class="paginate py-1 px-3 rounded-full transition duration-200"
        :class="{
          'opacity-50 cursor-not-allowed disabled': currentPage === totalPages,
        }"
      >
        <i class="fa-solid fa-chevron-right"></i>
      </NuxtLink>
    </div>

    <!-- using div  -->
    <div
      class="flex space-x-2 items-center text-[14px] w-full flex-wrap [&>a]:max-md:mb-2"
      v-else
    >
      <button
        @click="currentPage !== 1 && (localCurrentPage -= 1)"
        class="paginate py-1 px-3 rounded-full transition duration-200"
        :class="{
          'opacity-50 cursor-not-allowed disabled': currentPage === 1,
        }"
      >
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <button
        v-for="(item, index) in pagination"
        :key="index"
        @click="typeof item === 'number' && (localCurrentPage = Number(item))"
        :class="{
          '!bg-indigo-600 bg-opacity-90 !text-white': item === currentPage,
          paginate: typeof item === 'number',
          'text-gray-800': typeof item !== 'number',
        }"
        class="py-1 px-3 rounded-full lg:hover:bg-indigo-500 lg:hover:text-white transition duration-200"
      >
        {{ item }}
      </button>
      <button
        @click="currentPage !== totalPages && (localCurrentPage += 1)"
        class="paginate py-1 px-3 rounded-full transition duration-200"
        :class="{
          'opacity-50 cursor-not-allowed disabled': currentPage === totalPages,
        }"
      >
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  </template>
</template>
<script setup lang="ts">
type TProps = {
  link?: boolean;
  currentPage: number;
  totalPages: number;
  pagination: (string | number)[];
};

const props = withDefaults(defineProps<TProps>(), {
  link: true,
});

const emits = defineEmits(["update:currentPage"]);

const localCurrentPage = ref(props.currentPage);
watch(localCurrentPage, (newVal) => emits("update:currentPage", newVal));

const localProps = ref(props);
const route = useRoute();
</script>

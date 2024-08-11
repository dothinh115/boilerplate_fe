<template>
  <div class="space-y-4">
    <button
      class="flex items-center space-x-4 text-gray-100 text-[20px] cursor-pointer"
      @click.prevent="isFileShowed = !isFileShowed"
    >
      <i
        class="fa-solid fa-chevron-up"
        :class="{
          'rotate-180': !isFileShowed,
        }"
      ></i>
      <span> Files </span>
    </button>
    <div v-if="isFileShowed" class="space-y-2">
      <div
        class="flex items-center space-x-4 border-b border-blue-900 text-gray-100 pb-2"
      >
        <div class="w-[20px]"></div>
        <div
          :style="{
            width: `${widthData.id}px`,
          }"
        >
          Id
        </div>
        <div class="w-[150px]">Thời gian</div>
        <div
          :style="{
            width: `${widthData.mimeType}px`,
          }"
        >
          mimeType
        </div>
        <div
          :style="{
            width: `${widthData.size}px`,
          }"
        >
          Size
        </div>
      </div>

      <FileItem
        @change="handleChange"
        v-for="(item, index) in fileData"
        :key="index"
        :fileItem="item"
        :widthData
      >
        {{ item }}
      </FileItem>
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
  </div>
</template>
<script setup lang="ts">
import type { TFile } from "./Item.vue";

type TProps = {
  fileData: TFile[];
  fileSchema: any;
  totalPages: number;
  currentPage: number;
  pagination: (number | string)[];
};
const props = defineProps<TProps>();
const route = useRoute();
const emits = defineEmits(["change"]);
const isFileShowed = ref(true);
const widthData = ref();
const { $getMaxLength, $widthCalc } = useNuxtApp();

function handleChange() {
  emits("change");
}
widthData.value = $widthCalc(
  $getMaxLength({
    schema: props.fileSchema,
    data: props.fileData,
  })
);
</script>

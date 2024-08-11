<template>
  <div class="space-y-4">
    <div>
      <div class="text-gray-100" v-if="fileData.length === 0">
        Chưa có file nào ở đây...
      </div>
      <div class="space-y-2" v-else>
        <div class="flex space-x-4 items-center border-b border-blue-900 pb-2">
          <input
            class="checkbox"
            type="checkbox"
            @change="handleSelectAll"
            :checked="
              selectedList.length === fileData.length && fileData.length > 0
            "
          />

          <div class="flex items-center space-x-4 text-gray-100">
            <div class="w-[20px]"></div>
            <div
              :style="{
                width: `${widthData.id}px`,
              }"
            >
              Id
            </div>
            <div class="w-[150px]" v-if="screenWidth >= 769">Thời gian</div>
            <div
              :style="{
                width: `${widthData.mimeType}px`,
              }"
              v-if="screenWidth > 1024"
            >
              mimeType
            </div>
            <div
              :style="{
                width: `${widthData.size}px`,
              }"
              v-if="screenWidth >= 769"
            >
              Size
            </div>
          </div>
        </div>
        <FileItem
          @change="handleChange"
          v-for="(item, index) in fileData"
          :key="index"
          :fileItem="item"
          :widthData
          :selectedList
          @select="handleSelect"
        >
          {{ item }}
        </FileItem>
      </div>
    </div>
    <div
      class="flex items-center justify-between w-full max-md:flex-wrap max-md:space-y-4"
      :class="{
        '!justify-end': totalPages === 1,
      }"
      v-if="isFileShowed"
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
  selectedList: string[];
};
const props = defineProps<TProps>();
const route = useRoute();
const emits = defineEmits(["change", "select", "selectAll"]);
const isFileShowed = ref(true);
const widthData = ref();
const { $getMaxLength, $widthCalc } = useNuxtApp();
const { screenWidth, toastData, loading } = useGetState();
const confirmDeleteModal = ref(false);

function handleChange() {
  emits("change");
}

function handleSelect({ checked, id }: { checked: boolean; id: string }) {
  emits("select", {
    checked,
    id,
  });
}

widthData.value = $widthCalc(
  $getMaxLength({
    schema: props.fileSchema,
    data: props.fileData,
  })
);

function handleSelectAll(event: Event) {
  const target = event.target as HTMLInputElement;
  const checked = target.checked;
  emits("selectAll", checked);
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <div class="text-gray-100" v-if="fileData.length === 0">
        Chưa có file nào ở đây...
      </div>
      <div class="space-y-2" v-else>
        <div class="flex space-x-4 items-center border-b border-blue-900 pb-2">
          <InputCheckbox
            :checked="
              selectedList.length === fileData.length && fileData.length > 0
            "
            @change="handleSelectAll"
          />

          <div class="flex items-center space-x-4 text-gray-100">
            <div class="w-[20px]"></div>
            <div
              :style="{
                width: `${widthData.originalName}px`,
              }"
            >
              name
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
          @delete="handleDelete"
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
    <Paginate v-model:currentPage="localCurrentPage" :totalPages :pagination />
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
  selectedList: TFile[];
};
const props = defineProps<TProps>();
const emits = defineEmits([
  "change",
  "select",
  "selectAll",
  "update:currentPage",
]);
const widthData = ref();
const { $getMaxLength, $widthCalc } = useNuxtApp();
const { screenWidth } = useGetState();
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

function handleDelete() {
  emits("change");
}

function handleSelect({ checked, file }: { checked: boolean; file: TFile }) {
  emits("select", {
    checked,
    file,
  });
}

watchEffect(() => {
  widthData.value = $widthCalc(
    $getMaxLength({
      schema: props.fileSchema,
      data: props.fileData,
    })
  );
});

function handleSelectAll(checked: boolean) {
  emits("selectAll", checked);
}
</script>

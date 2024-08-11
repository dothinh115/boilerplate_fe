<template>
  <div class="space-y-4">
    <button
      class="flex items-center space-x-4 text-gray-100 text-[20px] cursor-pointer"
      @click.prevent="isFolderShowed = !isFolderShowed"
    >
      <i
        class="fa-solid fa-chevron-up"
        :class="{
          'rotate-180': !isFolderShowed,
        }"
      ></i>
      <span> Folders </span>
    </button>
    <div v-if="isFolderShowed" class="space-y-2">
      <FolderItem
        v-for="(item, index) in folderData"
        :key="index"
        :folderItem="item"
      >
        {{ item }}
      </FolderItem>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { TFolder } from "./Item.vue";

type TProps = {
  folderData: TFolder[];
};
const props = defineProps<TProps>();
const isFolderShowed = ref(false);
</script>

<template>
  <FolderItem
    v-for="(item, index) in folderList"
    :key="index"
    :folderData="item"
  >
    {{ item }}
  </FolderItem>
</template>
<script setup lang="ts">
import type { TFolder } from "./Item.vue";

type TProps = {
  folderList: TFolder[];
};
const props = defineProps<TProps>();
</script>

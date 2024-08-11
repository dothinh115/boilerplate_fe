<template>
  <div
    class="flex space-x-4 items-center border-b border-blue-900 pb-2 last:border-b-0"
  >
    <i class="fa-solid fa-folder text-[25px] text-cyan-400"></i>
    <NuxtLink
      :to="{
        name: 'upload-folder-id',
        params: {
          id: folderItem.id,
        },
      }"
      class="text-gray-200 text-[16px]"
      >{{ folderItem.name }}</NuxtLink
    >
  </div>
</template>
<script setup lang="ts">
export type TFolder = {
  id: string;
  name: string;
  user: TUser;
};
type TProps = {
  folderItem: TFolder;
};
const props = defineProps<TProps>();
</script>

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
    <FolderList :folderList="folderData" v-if="isFolderShowed" />
  </div>
</template>
<script setup lang="ts">
import type { TFolder } from "~/components/Folder/Item.vue";
const { loading } = useGetState();

const isFolderShowed = ref(true);
function showMenu() {
  isMenuShowed.value = !isMenuShowed.value;
}
const folderData = ref<TFolder[]>([]);
async function getFolder() {
  const params = {
    sort: "-createdAt",
  };
  const response = await useApi("/folder", { params });
  folderData.value = response.data;
}

const isMenuShowed = ref(false);

async function fetchAll() {
  loading.value = true;
  await getFolder();
  loading.value = false;
}

await fetchAll();
</script>

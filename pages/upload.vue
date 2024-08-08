<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div class="text-[25px] text-gray-200">upload</div>
      <div class="relative">
        <button
          class="h-[40px] aspect-1 bg-emerald-700 flex items-center justify-center text-gray-50 rounded-full duration-200 hover:bg-emerald-800"
          @click="isMenuShowed = !isMenuShowed"
          v-click-outside="
            () => {
              isMenuShowed = false;
            }
          "
        >
          <i class="fa-solid fa-plus"></i>
        </button>
        <div
          class="w-[200px] bg-white absolute top-[110%] right-0 rounded-[15px] h-fit overflow-hidden"
          v-if="isMenuShowed"
        >
          <ul @click="() => (isMenuShowed = false)">
            <li>
              <NuxtLink
                :to="undefined"
                class="lg:hover:bg-gray-100 p-2 block duration-200"
              >
                File
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="undefined"
                class="lg:hover:bg-gray-100 p-2 block duration-200"
              >
                Folder
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <NuxtPage />
  </div>
</template>
<script setup lang="ts">
import type { TFolder } from "~/components/Folder/Item.vue";

const route = useRoute();
const isMenuShowed = ref(false);
</script>

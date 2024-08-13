<template>
  <div class="space-y-4 xl:w-1/3 lg:w-1/2 md:w-3/4 w-[95%] mx-auto">
    <div class="bg-white shadow-lg rounded-lg overflow-hidden p-4">
      <div class="text-xl font-semibold text-gray-700 mb-4">
        {{ type === "upload" ? "Uploading..." : "Deleting..." }}
      </div>
      <div
        v-for="(item, index) in list"
        :key="index"
        class="flex items-center border-b border-gray-200 py-3 last:border-b-0 transition-colors duration-200"
      >
        <div
          class="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-200 text-indigo-500 mr-4"
        >
          <i class="fa-solid" :class="$iconClass(getFileType(item.file))"></i>
        </div>
        <div class="flex-1 truncate text-sm text-gray-600">
          {{ getFileName(item.file) }}
        </div>
        <div class="flex-shrink-0 ml-4">
          <Transition name="fade" @before-leave="removeTransition">
            <div
              v-if="item.type === 'succeeded'"
              class="flex items-center space-x-2"
            >
              <i class="fa-solid fa-check text-lg text-emerald-500"></i>
              <span class="text-xs">{{
                type === "upload" ? "Uploaded" : "Deleted"
              }}</span>
            </div>

            <i
              class="fa-solid fa-xmark text-lg text-red-500"
              v-else-if="item.type === 'failed'"
            ></i>
            <span class="gg-spinner" v-else></span>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { TFile } from "./Item.vue";

type TProps = {
  list: {
    file: File | TFile;
    type: "succeeded" | "failed" | "loading";
  }[];
  type?: "upload" | "delete";
};
withDefaults(defineProps<TProps>(), {
  type: "upload",
});

function removeTransition(el: Element) {
  (el as HTMLElement).style.display = "none";
}

function getFileType(file: File | TFile) {
  if ("type" in file) {
    return file.type;
  }
  return file.mimeType;
}

function getFileName(file: File | TFile) {
  if ("name" in file) {
    return file.name;
  }
  return file.originalName;
}
</script>

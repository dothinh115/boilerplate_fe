<template>
  <main>
    <div
      class="h-screen w-screen flex flex-col bg-[#2148c0] relative max-h-full"
    >
      <IconBackgroundTopRight class="absolute top-0 right-0" />
      <IconBackgroundBottomLeft class="absolute bottom-0 left-0" />
      <div class="max-h-full grid grid-cols-12 flex-grow gap-x-8 h-full">
        <div class="max-h-full lg:col-span-2 relative overflow-hidden">
          <TheSidebar />
        </div>
        <div
          class="lg:col-span-10 relative p-8 max-h-full h-full overflow-y-scroll"
        >
          <div class="h-full w-full p-4 max-h-full">
            <slot />
          </div>
        </div>
      </div>
    </div>
    <Teleport :to="'body'">
      <Transition name="fade">
        <div
          class="fixed w-full h-full top-0 left-0 bg-black bg-opacity-80 flex items-center justify-center z-[1000]"
          v-if="loading"
        >
          <span class="gg-spinner text-white"></span>
        </div>
      </Transition>
    </Teleport>
    <Toast
      :message="item.message"
      :type="item.type"
      @update:model-value="closeToast(index)"
      v-for="(item, index) in toastData"
      :key="index"
      :index="index"
    />
  </main>
</template>
<script setup lang="ts">
export type TToastData = {
  message: string;
  type: "success" | "error" | "warning" | "info";
}[];
const loading = useState("loading");
const toastData = useState<TToastData>("toastData", () => []);
const toastTimeout = ref();
const closeToast = (index: number) => {
  toastData.value.splice(index, 1);
};

// watchEffect(() => {
//   if (toastData.value.length > 0)
//     setTimeout(() => {
//       toastData.value = toastData.value.slice(1);
//     }, 6000);
//   else toastModel.value = false;
// });

watch(
  () => toastData.value.length,
  () => {
    if (toastData.value.length > 0) {
      clearTimeout(toastTimeout.value);
      toastTimeout.value = setTimeout(() => {
        toastData.value = toastData.value.slice(1);
      }, 6000);
    }
  }
);
</script>

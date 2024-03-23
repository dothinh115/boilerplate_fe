<template>
  <main>
    <div class="h-screen w-screen bg-[#2148c0] relative max-h-full flex">
      <IconBackgroundTopRight class="absolute top-0 right-0" />
      <IconBackgroundBottomLeft class="absolute bottom-0 left-0" />
      <SidebarSmall />
      <div class="max-h-full grid grid-cols-12 flex-grow h-full">
        <div
          class="max-h-full lg:col-span-2 relative overflow-hidden flex h-full"
          :class="{
            'col-span-12': !hideSidebar,
          }"
          v-show="!hideSidebar"
        >
          <SidebarMain />
        </div>
        <div
          class="relative lg:col-span-10 col-span-12 lg:p-8 md:p-6 p-4 max-h-full h-full overflow-y-scroll hidden-scrollbar"
          :class="{
            'lg:col-span-12': hideSidebar,
          }"
          v-show="(screenWidth <= 768 && hideSidebar) || screenWidth > 768"
        >
          <div class="h-full w-full max-h-full">
            <slot />
          </div>
        </div>
      </div>
    </div>
    <Loading />
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
const toastTimeout = ref();
const { screenWidth, toastData, hideSidebar } = useGetState();
const closeToast = (index: number) => {
  toastData.value.splice(index, 1);
};

window.addEventListener("resize", () => {
  screenWidth.value = screen.width;
});

watchEffect(() => {
  if (screenWidth.value <= 768) hideSidebar.value = true;
  else hideSidebar.value = false;
});

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

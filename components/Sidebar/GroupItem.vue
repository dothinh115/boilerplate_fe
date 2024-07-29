<template>
  <li>
    <NuxtLink
      :to="to ? to : undefined"
      class="flex items-center space-x-2 h-10 p-2 lg:hover:bg-indigo-800 lg:hover:text-gray-50 rounded-[0.375rem] duration-200"
      :active-class="'bg-indigo-800 text-gray-50'"
      @click="handleHideSidebar"
    >
      <div
        class="p-1 bg-indigo-500 rounded-[8px] text-gray-200 [&>i]:aspect-1 [&>i]:flex [&>i]:w-4 [&>i]:justify-center [&>i]:items-center"
      >
        <slot name="icon" />
      </div>
      <span> {{ title }}</span>
    </NuxtLink>
  </li>
</template>
<script setup lang="ts">
type TProps = {
  title: string;
  handle?: Function;
  to?: string;
};
const props = defineProps<TProps>();

const { screenWidth, hideSidebar } = useGetState();

function handleHideSidebar() {
  if (screenWidth.value <= 768 && !hideSidebar.value) hideSidebar.value = true;
}
</script>

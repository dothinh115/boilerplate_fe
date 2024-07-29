<template>
  <div class="text-gray-200">
    <div class="p-2 text-[13px]">
      {{ title }}
    </div>
    <ul class="space-y-2">
      <slot />
    </ul>
  </div>
</template>
<script setup lang="ts">
type TProps = {
  title: string;
};
const props = defineProps<TProps>();
</script>

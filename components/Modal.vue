<template>
  <div
    class="w-full h-full max-h-full fixed top-0 left-0 flex items-center justify-center bg-black bg-opacity-70"
    v-if="props.modelValue"
    @click.self="close"
  >
    <div class="absolute top-[2%] left-[2%] z-[1000]" v-if="props.closeBtn">
      <i
        class="fa-regular fa-circle-xmark text-[40px] text-gray-100 cursor-pointer"
        @click="close"
      ></i>
    </div>
    <div class="w-full max-h-[95%] h-[95%] flex items-center">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
type TProps = {
  modelValue: boolean;
  closeBtn?: boolean;
};
const props = defineProps<TProps>();
const emits = defineEmits(["update:modelValue"]);
const close = () => {
  emits("update:modelValue", false);
};
</script>

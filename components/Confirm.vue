<template>
  <div class="bg-gray-100 rounded-[5px] w-fit mx-auto">
    <div class="border-b border-gray-500 p-2 text-center space-y-4">
      <slot name="icon"></slot>
      <div>{{ message }}</div>
    </div>
    <div class="p-2 flex space-x-2 justify-center">
      <button class="btn btn-green btn-icon flex-1" @click="confirm">
        <i class="fa-solid fa-check"></i><span>Xác nhận</span>
      </button>
      <button class="btn btn-red btn-icon flex-1" @click="cancel">
        <i class="fa-solid fa-xmark"></i><span>Huỷ</span>
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
type TProps = {
  message: string;
  handle: Function;
  modelValue: boolean;
};
const props = defineProps<TProps>();
const emits = defineEmits(["update:modelValue"]);

const cancel = () => {
  emits("update:modelValue", false);
};
const confirm = () => {
  props.handle();
  emits("update:modelValue", false);
};
</script>

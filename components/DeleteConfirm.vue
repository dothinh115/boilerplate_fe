<template>
  <div class="bg-gray-100 rounded-[5px] w-fit mx-auto">
    <div class="border-b border-gray-500 p-2 text-center space-y-4">
      <i class="fa-solid fa-circle-exclamation text-[48px] text-red-600"></i>
      <div>Bạn có chắc chắn muốn xoá không??</div>
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
  handle: Function;
};
const props = defineProps<TProps>();
const emits = defineEmits(["confirm"]);
const cancel = () => {
  emits("confirm");
};
const confirm = () => {
  props.handle();
  emits("confirm");
};
</script>

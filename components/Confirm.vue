<template>
  <Teleport to="body">
    <Modal v-model="localModel" @update:model-value="cancel">
      <div
        class="bg-gray-100 rounded-[5px] lg:w-[300px] w-[95%] mx-auto overflow-hidden"
      >
        <div class="border-b border-gray-500 p-2 text-center space-y-4">
          <slot name="icon"></slot>
          <div>{{ message || "Bạn có chắc chắn không?" }}</div>
        </div>
        <div class="flex">
          <button
            class="btn-icon flex-1 p-2 bg-emerald-600 space-x-2 text-gray-50 lg:hover:bg-emerald-700 duration-200"
            @click="confirm"
          >
            <i class="fa-solid fa-check"></i><span>Xác nhận</span>
          </button>
          <button
            class="btn-icon flex-1 p-2 bg-red-500 space-x-2 text-gray-50 lg:hover:bg-red-700 duration-200"
            @click="cancel"
          >
            <i class="fa-solid fa-xmark"></i><span>Huỷ</span>
          </button>
        </div>
      </div>
    </Modal>
  </Teleport>
</template>
<script setup lang="ts">
type TProps = {
  message?: string;
  handle: Function;
  modelValue: boolean;
};
const props = defineProps<TProps>();
const emits = defineEmits(["update:modelValue"]);
const localModel = ref(props.modelValue);
watch(
  () => props.modelValue,
  (newVal) => {
    localModel.value = newVal;
  }
);
const cancel = () => {
  emits("update:modelValue", false);
};
const confirm = () => {
  props.handle();
  emits("update:modelValue", false);
};
</script>

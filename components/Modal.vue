<template>
  <Transition name="fade">
    <div
      class="w-full h-full max-h-full fixed top-0 left-0 flex items-center justify-center bg-black bg-opacity-70 z-[2]"
      :class="class"
      v-if="modelValue"
      @mousedown.self="close"
    >
      <div
        class="absolute top-[2%] left-[2%] z-[1000] w-12 h-12 flex items-center justify-center bg-gray-700 rounded-full cursor-pointer lg:hover:bg-gray-600 duration-200"
        v-if="closeBtn"
        @click="close"
      >
        <i class="fa-solid fa-x text-[20px] text-gray-100"></i>
      </div>
      <slot />
    </div>
  </Transition>
</template>
<script setup lang="ts">
type TProps = {
  modelValue: boolean;
  closeBtn?: boolean;
  zIndex?: number;
  class?: string;
};
const props = defineProps<TProps>();
const emits = defineEmits(["update:modelValue"]);

const close = (event: MouseEvent) => {
  if (event.button === 0) {
    emits("update:modelValue", false);
  }
};

onMounted(() => {
  document.body.classList.add("body-overflow-hidden");
  window.addEventListener("keyup", handleEscapePress);
});

onBeforeUnmount(() => {
  document.body.classList.remove("body-overflow-hidden");
  window.removeEventListener("keyup", handleEscapePress);
});

function handleEscapePress(event: KeyboardEvent) {
  if (event.key === "Escape") {
    emits("update:modelValue", false);
  }
}
</script>

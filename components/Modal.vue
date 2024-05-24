<template>
  <Transition name="fade">
    <div
      class="w-full h-full max-h-full fixed top-0 left-0 flex items-center justify-center bg-black bg-opacity-70"
      v-if="modelValue"
      @mousedown.self="close"
    >
      <div class="absolute top-[2%] left-[2%] z-[1000]" v-if="closeBtn">
        <i
          class="fa-regular fa-circle-xmark text-[40px] text-gray-100 cursor-pointer"
          @click="close"
        ></i>
      </div>
      <slot />
    </div>
  </Transition>
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
    close();
  }
}
</script>

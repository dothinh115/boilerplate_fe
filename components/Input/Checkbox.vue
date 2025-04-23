<template>
  <div class="relative flex items-center cursor-pointer w-fit">
    <input
      type="checkbox"
      class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-full before:w-full before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:opacity-0 before:transition-opacity"
      :checked
      @change="change"
      v-model="localModel"
      :id
      :class
    />
    <span
      class="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-3.5 w-3.5"
        viewBox="0 0 20 20"
        fill="currentColor"
        stroke="currentColor"
        stroke-width="1"
      >
        <path
          fill-rule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clip-rule="evenodd"
        ></path>
      </svg>
    </span>
  </div>
</template>
<script setup lang="ts">
type TProps = {
  checked?: boolean;
  modelValue?: boolean;
  id?: string;
  class?: string;
};
const props = defineProps<TProps>();
const localModel = ref(props.modelValue);
const emits = defineEmits(["change", "update:modelValue"]);
function change(event: Event) {
  const target = event.target as HTMLInputElement;
  const checked = target.checked;
  emits("change", checked);
  emits("update:modelValue", checked);
}
</script>

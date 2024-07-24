<template>
  <label class="cursor-pointer">
    <input
      type="checkbox"
      v-model="localValue"
      class="hidden peer"
      :disabled="disabled"
    />
    <div
      class="w-11 h-6 peer-checked:bg-blue-900 bg-gray-400 rounded-full relative after:content-[''] after:absolute after:block after:h-[90%] after:aspect-1 after:left-[1%] peer-checked:after:left-[unset] after:bg-white after:border after:top-[50%] after:-translate-y-[50%] after:rounded-full peer-checked:after:translate-x-full after:transition-all"
      :class="{
        'opacity-50 cursor-not-allowed': disabled,
      }"
    ></div>
  </label>
</template>
<script setup lang="ts">
type TProps = {
  modelValue: boolean;
  disabled?: boolean;
};
const props = defineProps<TProps>();
const emits = defineEmits(["update:modelValue"]);
const localValue = ref(props.modelValue);
watch(
  () => localValue.value,
  (newVal) => {
    emits("update:modelValue", newVal);
  }
);
</script>

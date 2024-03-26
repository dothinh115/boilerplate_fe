<template>
  <Teleport to="body">
    <div
      class="fixed top-[2%] right-[2%] opacity-0 p-2 rounded-[10px] bg-gray-100 shadow-[0px_0px_2px_1px] shadow-gray-400 duration-500 z-[1000]"
      :class="{
        'opacity-100': mounted,
      }"
    >
      <div class="flex justify-between md:w-[300px] md:min-h-[80px]">
        <div class="flex space-x-4">
          <div
            class="w-[6px] h-full rounded-full"
            :class="{
              'bg-red-500': props.type === 'error',
              'bg-emerald-700': props.type === 'success',
              'bg-yellow-600': props.type === 'warning',
              'bg-sky-600': props.type === 'info',
            }"
          ></div>
          <div class="space-y-2 flex flex-col justify-center">
            <div
              class="text-[20px]"
              :class="{
                'text-red-500': props.type === 'error',
                'text-emerald-700': props.type === 'success',
                'text-yellow-600': props.type === 'warning',
                'text-sky-600': props.type === 'info',
              }"
            >
              {{
                props.type === "error"
                  ? "Error"
                  : props.type === "info"
                  ? "Info"
                  : props.type === "success"
                  ? "Success"
                  : "Warning"
              }}
            </div>
            <div class="text-gray-800">{{ props.message }}</div>
          </div>
        </div>
        <div class="md:px-4 px-2">
          <button class="p-1" @click="close">
            <i class="fa-solid fa-xmark text-[20px]"></i>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
type TProps = {
  type: "error" | "success" | "warning" | "info";
  message: string;
  index: number;
};
const mounted = ref(false);
onMounted(() => {
  setTimeout(() => {
    mounted.value = true;
  }, 200);
  setTimeout(() => {
    mounted.value = false;
  }, 5000);
});

const props = defineProps<TProps>();
const emits = defineEmits(["update:modelValue"]);
const close = async () => {
  mounted.value = false;
  await new Promise((resolve) => setTimeout(resolve, 500));
  emits("update:modelValue", props.index);
};
</script>

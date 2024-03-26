<template>
  <NuxtLayout>
    <Modal :modelValue="true">
      <div
        class="space-y-8 lg:w-[20%] md:w-[60%] w-[95%] mx-auto max-h-full rounded-[10px] h-full flex items-center"
      >
        <div
          class="rounded-[10px] max-h-full overflow-y-scroll hidden-scrollbar relative w-full"
        >
          <div
            class="flex items-center justify-center space-x-2 title sticky top-0 z-[1000] !p-2"
          >
            <i
              class="fa-solid fa-arrow-left-long cursor-pointer bg-white p-1 rounded-full text-indigo-600 absolute left-2"
              @click="handleError"
            ></i>
            <div>{{ error.statusCode }}</div>
          </div>
          <div class="bg-gray-50 p-4">
            {{ error?.message || "Đã xảy ra lỗi không xác định." }}
          </div>
        </div>
      </div>
    </Modal>
  </NuxtLayout>
</template>
<script setup>
const error = useError();
function handleError() {
  clearError({
    redirect: error.value.data ? error.value.data?.fullPath : "/",
  });
}
</script>

<template>
  <NuxtLayout name="login">
    <div class="relative py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div class="mx-auto max-w-screen-sm text-center">
        <h1
          class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-gray-50"
        >
          {{ error?.statusCode }}
        </h1>

        <p class="mb-4 text-xl font-light text-gray-200">
          {{
            error?.statusCode === 404
              ? "Không tìm thấy page này trong hệ thống"
              : error?.message
          }}
        </p>
        <button
          @click="handleClearError"
          class="inline-flex text-white bg-indigo-500 lg:hover:bg-indigo-800 focus:ring-2 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4 duration-200"
        >
          Quay về trang chủ
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>
<script setup lang="ts">
type TProps = {
  error: any;
};
const error = useError();
defineProps<TProps>();
async function handleClearError() {
  await navigateTo("/");
  clearError();
}
</script>

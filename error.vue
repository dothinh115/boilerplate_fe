<template>
  <NuxtLayout>
    <div
      class="space-y-8 lg:w-[5 0%] md:w-[60%] w-[95%] mx-auto max-h-full rounded-[10px] h-full flex items-center"
    >
      <div
        class="rounded-[10px] max-h-full overflow-y-scroll hidden-scrollbar relative w-full"
      >
        <div
          class="flex items-center justify-center space-x-2 title sticky top-0 z-[1000] !p-2"
        >
          <div>{{ error.statusCode }}</div>
        </div>
        <div class="bg-gray-50 p-4">Không tìm thấy trang này</div>
      </div>
    </div>
  </NuxtLayout>
</template>
<script setup>
const error = useError();
</script>

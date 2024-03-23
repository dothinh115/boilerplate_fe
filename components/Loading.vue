<template>
  <Teleport :to="'body'">
    <Transition name="fade">
      <div
        class="fixed w-full h-full top-0 left-0 bg-black bg-opacity-80 flex items-center justify-center z-[1000]"
        v-if="loading"
      >
        <span class="gg-spinner text-white"></span>
      </div>
    </Transition>
  </Teleport>
</template>
<script setup lang="ts">
const { loading } = useGetState();
</script>

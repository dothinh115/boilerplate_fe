<template>
  <DynamicList
    :api="{
      dataApi,
      schemaApi,
    }"
  />
  <NuxtPage />
</template>
<script setup lang="ts">
const route = useRoute();
const dataApi = `/${route.params.pre}/${route.params.post}`;
const schemaApi = `/schema/${route.params.post}`;
</script>

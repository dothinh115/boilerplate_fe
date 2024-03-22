<template>
  <DynamicList
    :api="{
      listApi,
      schemaApi,
    }"
  />
  <NuxtPage />
</template>
<script setup lang="ts">
const route = useRoute();
const listApi = `/${route.params.pre}/${route.params.post}`;
const schemaApi = `/schema/${route.params.post}`;
</script>

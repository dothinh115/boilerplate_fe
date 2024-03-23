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
const listApi = `/api/${route.params.pre}`;
const schemaApi = `/schema/${route.params.pre}`;
</script>

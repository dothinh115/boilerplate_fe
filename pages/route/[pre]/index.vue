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
const dataApi = `/api/${route.params.pre}`;
const schemaApi = `/schema/${route.params.pre}`;
</script>

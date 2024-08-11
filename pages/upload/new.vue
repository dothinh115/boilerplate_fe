<template>
  <Teleport to="body">
    <Modal v-model="modal">
      <Upload @submit-upload="handleUpload" />
    </Modal>
  </Teleport>
</template>
<script setup lang="ts">
const modal = ref(true);
async function handleUpload(file: File) {
  console.log(file);
}
</script>

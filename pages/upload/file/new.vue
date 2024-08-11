<template>
  <Teleport to="body">
    <Modal v-model="modal" :close-btn="true" @update:model-value="handleGoBack">
      <Upload @submit-upload="handleUpload" />
    </Modal>
  </Teleport>
</template>
<script setup lang="ts">
const modal = ref(true);
const router = useRouter();
const { isFromInside, toastData, loading } = useGetState();

async function handleUpload(file: File) {
  try {
    loading.value = true;
    const formData = new FormData();
    formData.append("file", file);
    await useApi("/file", {
      method: "POST",
      body: formData,
    });
    loading.value = false;
    handleGoBack();
  } catch (error: any) {
    toastData.value.push({
      message: error.data.message,
      type: "error",
    });
  }
}

function handleGoBack() {
  if (isFromInside) {
    return navigateTo({
      name: "upload",
    });
  } else {
    router.back();
  }
}

definePageMeta({
  middleware: [
    (to, from) => {
      const { isFromInside } = useGetState();
      if (from.name) isFromInside.value = true;
      else isFromInside.value = false;
    },
  ],
});
</script>

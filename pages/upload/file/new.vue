<template>
  <Teleport to="body">
    <Modal
      v-model="uploadModal"
      :close-btn="true"
      @update:model-value="handleGoBack"
    >
      <Upload @submit-upload="handleUpload" :multiple="true" />
    </Modal>
  </Teleport>
  <Teleport to="body">
    <Modal
      v-model="resultModal"
      :close-btn="true"
      @update:model-value="handleGoBack"
    >
      <FileResult :list="uploadList" />
    </Modal>
  </Teleport>
</template>
<script setup lang="ts">
import { useToast } from "vue-toastification";
const uploadModal = ref(false);
const resultModal = ref(false);
const uploadList = ref<
  {
    file: File;
    type: "succeeded" | "failed" | "loading";
  }[]
>([]);
const toast = useToast();

setTimeout(() => {
  uploadModal.value = true;
}, 100);

async function handleUpload(files: File[]) {
  if (files.length > 5) {
    toast.warning("Upload tối đa 5 files cùng lúc");
    return;
  }
  uploadModal.value = false;
  resultModal.value = true;
  const promises = [];

  const handleSingleUpload = async (file: File) => {
    uploadList.value.push({
      file,
      type: "loading",
    });
    const formData = new FormData();
    formData.append("file", file);
    try {
      await useApi("/file", {
        method: "POST",
        body: formData,
      });
      const find = uploadList.value.find((x) => x.file === file);
      if (find) find.type = "succeeded";
    } catch (error) {
      const find = uploadList.value.find((x) => x.file === file);
      if (find) find.type = "failed";
    }
  };

  for (const file of files) {
    promises.push(handleSingleUpload(file));
  }
  await Promise.all(promises);
}

function handleGoBack() {
  uploadList.value = [];
  useGoBack({
    navigate: {
      name: "upload",
    },
    options: {
      replace: true,
    },
  });
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

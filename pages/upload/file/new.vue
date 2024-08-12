<template>
  <Teleport to="body">
    <Modal v-model="modal" :close-btn="true" @update:model-value="handleGoBack">
      <Upload
        @submit-upload="handleUpload"
        :multiple="true"
        :success="successfulUpload"
      />
    </Modal>
  </Teleport>
</template>
<script setup lang="ts">
const modal = ref(true);
const router = useRouter();
const { isFromInside } = useGetState();
const successfulUpload = ref<
  {
    file: File;
    type: "success" | "fail" | "loading";
  }[]
>([]);

async function handleUpload(files: File[]) {
  for (const file of files) {
    successfulUpload.value.push({
      file,
      type: "loading",
    });
    const formData = new FormData();
    formData.append("file", file);
    const response = await useApi("/file", {
      method: "POST",
      body: formData,
    });
    const find = successfulUpload.value.find((x) => x.file === file);
    if (find) find.type = response ? "success" : "fail";
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

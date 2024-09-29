<template>
  <Teleport to="body">
    <Modal v-model="modal" @update:model-value="handleClose">
      <DynamicItem :schema :new="true" @close="handleClose" />
    </Modal>
  </Teleport>
</template>
<script setup lang="ts">
const route = useRoute();
const { $roleCheck } = useNuxtApp();
const accessible = $roleCheck("POST", route.params.post as string);
if (!accessible) {
  throw showError({
    statusCode: 403,
    message: "Bạn không có quyền này!",
  });
}
const modal = ref(false);
const { startLoading, finishLoading } = useLoading();
const schemaApi = `/schema/${route.params.post}`;
const schema = useState<any>(schemaApi);
setTimeout(() => (modal.value = true), 50);

async function getSchema() {
  if (schema.value) return;
  startLoading();
  const result: any = await useApi(schemaApi);
  schema.value = result.data;
  finishLoading();
}

function handleClose() {
  useGoBack({
    navigate: {
      name: "route-post",
      params: {
        post: route.params.post,
      },
      query: {
        ...route.query,
      },
    },
    options: {
      replace: true,
    },
  });
}

await getSchema();
</script>

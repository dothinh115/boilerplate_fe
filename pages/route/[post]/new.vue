<template>
  <Teleport to="body">
    <Modal v-model="modal" @update:model-value="handleClose">
      <DynamicItem :schema :new="true" @close="handleClose" />
    </Modal>
  </Teleport>
</template>
<script setup lang="ts">
const route = useRoute();
const modal = ref(false);
const { loading } = useGetState();
const schemaApi = `/schema/${route.params.post}`;
const schema = useState<any>(schemaApi);
setTimeout(() => (modal.value = true), 50);

async function getSchema() {
  if (schema.value) return;
  loading.value = true;

  const result: any = await useApi(schemaApi);
  schema.value = result.data;
  loading.value = false;
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

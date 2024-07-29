<template>
  <Teleport to="body">
    <Modal v-model="modelValue">
      <DynamicItem :schema v-model="data" :new="true" />
    </Modal>
  </Teleport>
</template>
<script setup lang="ts">
const route = useRoute();
const modelValue = ref(true);
const { loading } = useGetState();
const data = ref<any>({});
const schemaApi = `/schema/${route.params.post}`;
const schema = useState<any>(schemaApi);

async function getSchema() {
  if (schema.value) return;
  loading.value = true;

  const result: any = await useApi(schemaApi);
  schema.value = result.data;
  loading.value = false;
}

await getSchema();
</script>

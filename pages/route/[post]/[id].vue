<template>
  <DynamicItem :schema v-model="data" />
</template>
<script setup lang="ts">
const route = useRoute();
const { id, post } = route.params;
const { loading } = useGetState();
const schemaApi = `/schema/${route.params.post}`;
const dataApi = `/${post}`;
const schema = useState<any>(schemaApi);
const data = ref<any>({});

async function getSchema() {
  if (schema.value) return;
  const result: any = await useApi(schemaApi);
  schema.value = result;
}

async function getData() {
  const params = {
    "filter[id][_eq]": id,
  };
  const result: any = await useApi(dataApi, { params });
  data.value = result.data[0];
}

async function fetchData() {
  loading.value = true;
  await getSchema();
  await getData();
  loading.value = false;
}

await fetchData();
definePageMeta({
  middleware: [
    (to, from) => {
      const { isFromInside } = useGetState();
      if (from.name) isFromInside.value = true;
    },
  ],
});
</script>

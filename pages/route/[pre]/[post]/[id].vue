<template>
  <DynamicItem
    :info="{
      schema,
      data,
    }"
  />
</template>
<script setup lang="ts">
const route = useRoute();
const { id, pre, post } = route.params;
const loading = useState("loading");
const schemaApi = `/schema/${route.params.post}`;
const dataApi = `/${pre}/${post}`;
const schema = ref<any>({});
const data = ref<any>({});

async function getSchema() {
  const result: any = await useApi(schemaApi);
  schema.value = result.data;
}

async function getData() {
  const params = {
    "filter[_id][$eq]": id,
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
</script>

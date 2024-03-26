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
const { loading } = useGetState();
const schemaApi = `/schema/${route.params.post}`;
const dataApi = `/${pre}/${post}`;
const schema = useState<any>(schemaApi, () => {});
const data = ref<any>({});

async function getSchema() {
  if (schema.value) return;
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
  const promises = [getSchema(), getData()];
  await Promise.all(promises);
  loading.value = false;
}

await fetchData();
definePageMeta({
  middleware: [
    (to, from) => {
      const isFromInside = useState("isFromInside", () => false);
      if (to.name !== from.name) isFromInside.value = true;
    },
  ],
});
</script>

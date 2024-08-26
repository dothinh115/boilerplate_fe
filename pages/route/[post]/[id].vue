<template>
  <Teleport to="body">
    <Modal v-model="modal" @update:model-value="handleClose">
      <DynamicItem :schema :itemData="data" @close="handleClose" />
    </Modal>
  </Teleport>
</template>
<script setup lang="ts">
const route = useRoute();
const { id, post } = route.params;
const { startLoading, finishLoading } = useLoading();
const schemaApi = `/schema/${route.params.post}`;
const dataApi = `/${post}`;
const schema = useState<any>(schemaApi);
const data = ref<any>({});
const modal = ref(false);
setTimeout(() => (modal.value = true), 50);

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
  startLoading();
  await getSchema();
  await getData();
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

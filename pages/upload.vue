<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div class="text-[25px] text-gray-200">upload</div>
      <div class="relative">
        <NuxtLink
          class="h-[40px] aspect-1 bg-emerald-700 flex items-center justify-center text-gray-50 rounded-full duration-200 hover:bg-emerald-800"
          :to="{
            name: 'upload-file-new',
          }"
        >
          <i class="fa-solid fa-plus"></i>
        </NuxtLink>
        <div
          class="w-[200px] bg-white absolute top-[110%] right-0 rounded-md h-fit overflow-hidden"
          v-if="isMenuShowed"
        >
          <ul @click="() => (isMenuShowed = false)">
            <li>
              <NuxtLink
                :to="{
                  name: 'upload-file-new',
                }"
                class="lg:hover:bg-gray-100 p-2 block duration-200"
              >
                File
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="undefined"
                class="lg:hover:bg-gray-100 p-2 block duration-200"
              >
                Folder
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- Folder -->
    <!-- <FolderList :folderData /> -->
    <!-- Folder -->

    <!-- File -->
    <FileList
      :fileData
      :fileSchema
      :totalPages
      :currentPage
      :pagination
      @change="handleChange"
    />
    <!-- File -->
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import type { TFolder } from "~/components/Folder/Item.vue";

const route = useRoute();
const isMenuShowed = ref(false);
const { loading, screenWidth } = useGetState();
const folderData = ref<TFolder[]>([]);
const fileData = ref<any[]>([]);
const fileSchema = useState("/schema/file");
const perPage = 15;
const currentPage = ref(Number(route.query.page) || 1);
const totalPages = ref(0);
const pagination = ref<(string | number)[]>([]);

async function getFolders() {
  const params = {
    sort: "-createdAt",
  };
  const response = await useApi("/folder", { params });
  folderData.value = response.data;
}

async function getFiles() {
  const params = {
    sort: "-createdAt",
    limit: perPage,
    page: currentPage.value,
    meta: "*",
  };
  const response = await useApi("/file", { params });
  totalPages.value = Math.ceil(response.meta.totalCount / perPage);
  fileData.value = response.data;
}

async function getFileSchema() {
  if (fileSchema.value) return;
  const response = await useApi("/schema/file");
  fileSchema.value = response;
}

async function fetchAll() {
  loading.value = true;
  await getFileSchema();
  // await getFolders();
  await getFiles();
  loading.value = false;
}

watchEffect(() => {
  usePaginate(
    {
      totalPages: totalPages.value || 0,
      currentPage: currentPage.value,
      range: screenWidth.value <= 768 ? 1 : 2,
    },
    (paginate: (string | number)[]) => {
      pagination.value = paginate;
    }
  );
});

watch(
  () => route.query.page,
  async (newVal) => {
    if (newVal) {
      currentPage.value = Number(newVal);
      await fetchAll();
    }
  }
);
onBeforeRouteUpdate(async (to, from) => {
  if (
    from.name?.toString().includes(to.name?.toString() as string) &&
    from.name !== to.name
  ) {
    await fetchAll();
  }
});

async function handleChange() {
  await fetchAll();
}

await fetchAll();
</script>

<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div class="text-[25px] text-gray-200">upload</div>
      <div class="flex items-center md:space-x-4 space-x-2">
        <button
          class="h-[40px] aspect-1 bg-red-700 flex items-center justify-center text-gray-50 rounded-full duration-200 hover:bg-red-800 disabled:opacity-50"
          :disabled="selectedList.length === 0"
          @click="confirmDeleteModal = true"
        >
          <i class="fa-solid fa-trash"></i>
        </button>
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
      :selectedList
      @change="handleChange"
      @select="handleSelect"
      @selectAll="handleSelectAll"
    />
    <!-- File -->
    <NuxtPage />
  </div>
  <Confirm
    v-model="confirmDeleteModal"
    :handle="handleMultipleDelete"
    :message="'Bạn có chắc chắn muốn xoá những file đã chọn không?'"
  >
    <template #icon>
      <i class="fa-solid fa-trash text-[40px] text-red-500"></i>
    </template>
  </Confirm>
  <Teleport to="body">
    <Modal
      v-model="deleteModal"
      :closeBtn="true"
      :onUpdate:modelValue="handleClose"
    >
      <FileResult :list="deleteList" :type="'delete'" />
    </Modal>
  </Teleport>
</template>

<script setup lang="ts">
import type { TFile } from "~/components/File/Item.vue";
import type { TFolder } from "~/components/Folder/Item.vue";

const route = useRoute();
const isMenuShowed = ref(false);
const { loading, screenWidth, shouldRevalidate } = useGetState();
const folderData = ref<TFolder[]>([]);
const fileData = ref<any[]>([]);
const fileSchema = useState("/schema/file");
const currentPage = ref(Number(route.query.page) || 1);
const totalPages = ref(0);
const pagination = ref<(string | number)[]>([]);
const selectedList = ref<TFile[]>([]);
const confirmDeleteModal = ref(false);
const deleteModal = ref(false);
const deleteList = ref<
  {
    file: TFile;
    type: "succeeded" | "failed" | "loading";
  }[]
>([]);

const perPage = computed(() => {
  if (screenWidth.value <= 375) return 9; //iphone SE
  else if (screenWidth.value > 375 && screenWidth.value <= 390)
    return 13; //iphone pro
  else if (screenWidth.value > 390 && screenWidth.value <= 414)
    return 14; //iphone XR
  else return 15;
});

function handleSelect({ checked, file }: { checked: boolean; file: TFile }) {
  if (checked) {
    selectedList.value.push(file);
  } else {
    selectedList.value = selectedList.value.filter((x) => x !== file);
  }
}

function handleSelectAll(checked: boolean) {
  if (checked) {
    selectedList.value = fileData.value;
  } else {
    selectedList.value = [];
  }
}

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
    limit: perPage.value,
    page: currentPage.value,
    meta: "*",
  };
  const response = await useApi("/file", { params });
  totalPages.value = Math.ceil(response.meta.totalCount / perPage.value);
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

async function handleMultipleDelete() {
  deleteModal.value = true;
  const promises = [];
  const handleSingleDelete = async (file: TFile) => {
    deleteList.value.push({
      file,
      type: "loading",
    });
    try {
      await useApi(`/file/${file.id}`, {
        method: "DELETE",
      });
      const find = deleteList.value.find((x) => x.file === file);
      if (find) find.type = "succeeded";
    } catch (error: any) {
      const find = deleteList.value.find((x) => x.file === file);
      if (find) find.type = "failed";
    }
  };
  for (const file of selectedList.value) {
    promises.push(handleSingleDelete(file));
  }
  await Promise.all(promises);
  await getFiles();
}

async function handleClose() {
  await fetchAll();
  selectedList.value = [];
  deleteList.value = [];
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

async function revalidate() {
  loading.value = true;
  await getFiles();
  loading.value = false;
}
// onBeforeRouteUpdate(async (to, from) => {
//   if (
//     from.name?.toString().includes(to.name?.toString() as string) &&
//     from.name !== to.name
//   ) {
//     await fetchAll();
//   }
// });

watch(shouldRevalidate, async (newVal) => {
  if (newVal) {
    await revalidate();
    shouldRevalidate.value = false;
  }
});

async function handleChange() {
  await fetchAll();
}

await fetchAll();
</script>

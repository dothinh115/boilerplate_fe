<template>
  <Teleport to="body">
    <Modal v-model="modal" :close-btn="true" @update:model-value="handleGoBack">
      <div
        class="bg-gray-100 xl:w-1/3 lg:w-1/2 md:w-3/4 w-[95%] rounded-lg overflow-y-scroll md:max-h-[95%] max-h-[80%] hidden-scrollbar"
      >
        <div
          class="md:h-[350px] h-[250px]"
          :style="`background: url('/api/asset/${fileData?.id}') no-repeat center / cover`"
          v-if="fileData?.mimeType.startsWith('image/')"
        ></div>
        <div
          v-for="([key, value], index) in Object.entries(fileSchema)"
          :key="index"
          class="flex items-center p-4 border-b border-gray-300 hover:bg-gray-50"
        >
          <span class="flex items-center text-gray-700 mr-3">
            <i v-if="key === 'mimeType'" class="fa-solid fa-file-zipper"></i>
            <i
              v-else-if="key === 'size'"
              class="fa-solid fa-weight-hanging"
            ></i>
            <i
              v-else-if="key === 'originalName'"
              class="fa-solid fa-file-alt"
            ></i>
            <i v-else class="fa-solid fa-info-circle"></i>
          </span>

          <span class="flex-grow font-semibold text-gray-700 capitalize">
            {{ key }}:
          </span>

          <span class="text-gray-900 truncate max-w-xs">
            {{
              fileData &&
              fileData[key as keyof TFile] &&
              (key === "size"
                ? (
                    (fileData[key as keyof TFile] as number) /
                    1024 /
                    1024
                  ).toFixed(2) + " Mb"
                : fileData[key as keyof TFile])
            }}
          </span>
        </div>
        <template v-if="fileData?.mimeType.startsWith('image/')">
          <div class="flex space-x-4 px-4 py-2">
            <div class="flex flex-col flex-grow">
              <label for="width" class="text-gray-600 font-medium"
                >Width:</label
              >
              <input
                type="number"
                class="input"
                placeholder="Enter width"
                v-model="width"
              />
            </div>
            <div class="flex flex-col flex-grow">
              <label for="height" class="text-gray-600 font-medium"
                >Height:</label
              >
              <input
                type="number"
                class="input"
                placeholder="Enter height"
                v-model="height"
              />
            </div>
            <!-- <div class="flex flex-col flex-grow">
              <label for="format" class="text-gray-600 font-medium"
                >Format:</label
              >
              <select class="select">
                <option value="png">PNG</option>
                <option value="webp">WEBP</option>
                <option value="jpg">JPG</option>
              </select>
            </div> -->
          </div>
          <div class="px-4 py-2">
            <a
              class="btn btn-blue block w-full text-center"
              :href="`/api/asset/${fileData.id}?type=download${
                width ? `&width=${width}` : ''
              }${height ? `&height=${height}` : ''}`"
              target="_blank"
              >Tải xuống</a
            >
          </div>
        </template>
      </div>
    </Modal>
  </Teleport>
</template>
<script setup lang="ts">
import type { TFile } from "~/components/File/Item.vue";

const route = useRoute();
const router = useRouter();
const modal = ref(true);
const { isFromInside, loading } = useGetState();
const fileData = ref<TFile>();
const fileSchema = useState<Object>("/schema/file");
const width = ref();
const height = ref();

async function getFileData() {
  const params = {
    "filter[id][_eq]": route.params.id,
  };
  const response = await useApi("/file", {
    params,
  });
  fileData.value = response.data[0];
}

async function getFileSchema() {
  if (fileSchema.value) return;
  const response = await useApi("/schema/file");
  fileSchema.value = response;
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

async function fetchAll() {
  loading.value = true;
  await getFileSchema();
  await getFileData();
  loading.value = false;
}

await fetchAll();

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

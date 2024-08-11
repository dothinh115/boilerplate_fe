<template>
  <div
    class="flex items-center pb-2 last:border-b-0 border-b border-blue-900 space-x-4"
  >
    <input
      class="checkbox"
      type="checkbox"
      @change="handleSelect"
      :checked="selectedList.find((x) => x === fileItem.id) ? true : false"
    />
    <NuxtLink
      class="flex space-x-4 items-center flex-grow"
      :to="{
        name: 'upload-file-id',
        params: {
          id: props.fileItem.id,
        },
      }"
    >
      <div class="text-[20px] w-[20px]">
        <i class="fa-solid" :class="iconClass"></i>
      </div>

      <div
        class="text-gray-200 truncate"
        :style="{
          width: `${widthData.id}px`,
        }"
      >
        {{ fileItem.id }}
      </div>
      <div class="text-gray-200 truncate w-[150px]" v-if="screenWidth >= 769">
        {{ $timeAgo(fileItem.createdAt) }}
      </div>
      <div
        class="text-gray-200 truncate"
        :style="{
          width: `${widthData.mimeType}px`,
        }"
        v-if="screenWidth > 1024"
      >
        {{ fileItem.mimeType }}
      </div>
      <div
        class="text-gray-200 truncate"
        :style="{
          width: `${widthData.size}px`,
        }"
        v-if="screenWidth >= 769"
      >
        {{ (fileItem.size / 1024 / 1024).toFixed(2) }} Mb
      </div>
    </NuxtLink>
    <div class="relative">
      <div class="flex items-center space-x-2" v-if="copiedToClipboard">
        <i class="fa-solid fa-check text-[20px] text-emerald-500"></i>
        <span class="text-gray-100">Copied</span>
      </div>
      <button
        v-else
        class="w-[25px] aspect-1 bg-indigo-500 lg:hover:bg-indigo-400 text-gray-200 rounded-lg flex items-center justify-center focus:ring-2"
        @click.stop="toggleMenu"
        ref="menuButtonRef"
      >
        <i class="fa-solid fa-ellipsis"></i>
      </button>

      <div
        class="z-[1] bg-white rounded-lg w-44 absolute top-[calc(100%+5px)] right-0 overflow-hidden"
        v-if="isMenuShowed"
        v-click-outside="handleOutsideClick"
      >
        <ul class="text-sm text-gray-700 dark:text-gray-200">
          <li v-if="$roleCheck('DELETE', 'file')">
            <button
              class="w-full px-4 py-2 hover:bg-gray-100 text-gray-600 flex items-center space-x-2"
              @click="handleDeleteClick"
            >
              <i class="fa-solid fa-trash-can"></i>
              <span>Xoá</span>
            </button>
          </li>
          <li>
            <button
              class="w-full px-4 py-2 hover:bg-gray-100 text-gray-600 flex items-center space-x-2"
              @click="handleCopyLink"
            >
              <i class="fa-solid fa-copy"></i>
              <span>Copy link</span>
            </button>
          </li>
          <li>
            <a
              class="w-full px-4 py-2 hover:bg-gray-100 text-gray-600 flex items-center space-x-2"
              :href="`/api/asset/${fileItem.id}?type=download`"
              target="_blank"
            >
              <i class="fa-solid fa-download"></i>
              <span>Tải về</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <Confirm :handle="handleDelete" v-model="confirmDeleteModal">
    <template #icon>
      <i
        class="fa-solid fa-right-from-bracket text-[48px] text-indigo-600 rotate-180"
      ></i>
    </template>
  </Confirm>
</template>
<script setup lang="ts">
export type TFile = {
  id: string;
  user: string;
  extension: string;
  folder: string | null;
  hash: string;
  originalName: string;
  size: number;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
};
type TProps = {
  fileItem: TFile;
  widthData: any;
  selectedList: string[];
};
const props = defineProps<TProps>();
const emits = defineEmits(["change", "select"]);
const isMenuShowed = ref(false);
const confirmDeleteModal = ref(false);
const { toastData, screenWidth } = useGetState();
const menuButtonRef = ref<HTMLButtonElement | null>(null);
const copiedToClipboard = ref(false);

const iconClass = computed(() => {
  switch (props.fileItem.mimeType) {
    case "image/jpg":
    case "image/png":
    case "image/webp":
    case "image/jpeg":
      return "fa-image text-red-500";
    case "application/pdf":
      return "fa-file-pdf text-red-400";
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return "fa-file-excel text-emerald-600";
    case "application/zip":
      return "fa-file-zipper text-yellow-500";
    default:
      return "fa-file text-gray-100";
  }
});

function toggleMenu() {
  isMenuShowed.value = !isMenuShowed.value;
}

function handleDeleteClick() {
  confirmDeleteModal.value = true;
}

function handleOutsideClick(event: MouseEvent) {
  if (
    event.target === menuButtonRef.value ||
    (menuButtonRef.value && menuButtonRef.value.contains(event.target as Node))
  )
    return;
  isMenuShowed.value = false;
}

function handleSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  const checked = target.checked;
  emits("select", {
    checked,
    id: props.fileItem.id,
  });
}

function handleCopyLink() {
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  navigator.clipboard
    .writeText(`${baseUrl}/api/asset/${props.fileItem.id}`)
    .then(() => {
      copiedToClipboard.value = true;
      isMenuShowed.value = false;
    })
    .catch((err) => {
      alert("Có lỗi xảy ra!");
    });
}

watch(
  () => copiedToClipboard.value,
  (newVal) => {
    if (newVal) {
      setTimeout(() => {
        copiedToClipboard.value = false;
      }, 3000);
    }
  }
);

async function handleDelete() {
  try {
    await useApi(`/file/${props.fileItem.id}`, {
      method: "DELETE",
    });
    emits("change");
  } catch (error: any) {
    toastData.value.push({
      type: "error",
      message: error.data.message,
    });
  } finally {
    isMenuShowed.value = false;
  }
}
</script>

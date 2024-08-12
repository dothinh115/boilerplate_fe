<template>
  <div class="space-y-2 xl:w-1/3 lg:w-1/2 md:w-3/4 w-[95%]">
    <div class="bg-gray-50 rounded-lg overflow-hidden">
      <div class="flex items-center justify-center w-full p-2 flex-wrap">
        <div
          @click="handleClick"
          class="flex flex-col items-center justify-center w-full cursor-pointer bg-gray-100 rounded-t-lg group p-6 md:h-[350px] h-[250px]"
          :style="!multiple && backgroundStyle"
          v-if="success?.length === 0"
        >
          <div
            class="flex flex-col items-center justify-center pt-5 pb-6 space-y-4 md:w-3/4 w-[90%] rounded-lg group-hover:bg-gray-200 duration-200 border-2 border-gray-400 border-dashed"
            v-if="!preview"
          >
            <i class="fa-solid fa-cloud-arrow-up text-gray-500 text-[40px]"></i>
            <p class="mb-2 text-sm text-gray-500 dark:text-gray-500">
              <span class="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-500">
              <slot name="warning" />
            </p>
          </div>
        </div>
        <button
          class="btn btn-red w-full !rounded-t-none"
          @click="clearPreview"
          v-if="preview"
        >
          Xoá
        </button>
      </div>
      <div>
        <div
          v-for="(item, index) in files"
          :key="index"
          class="m-2 flex items-center border-b border-indigo-300 pb-2 last:border-b-0"
        >
          <div class="w-[20px]">
            <i class="fa-solid" :class="$iconClass(item.type)"></i>
          </div>
          <div class="md:w-[300px] w-[250px] truncate text-[14px]">
            {{ item.name }}
          </div>
          <div class="text-right flex-grow">
            <button
              class="text-lg text-red-500"
              @click="handleDeletePreviewItem(index)"
              v-if="success?.length === 0"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
            <i
              class="fa-solid fa-check text-lg text-emerald-500"
              v-else-if="
                success?.find((x) => x.file === item)?.type === 'success'
              "
            ></i>
            <i
              class="fa-solid fa-xmark text-lg text-red-500"
              v-else-if="success?.find((x) => x.file === item)?.type === 'fail'"
            ></i>
            <span class="gg-spinner" v-else></span>
          </div>
        </div>
      </div>
      <div class="p-2 space-y-2">
        <div>
          <slot name="html" />
        </div>
        <button
          class="btn btn-green block w-full"
          @click="handleUpload"
          :disabled="!isValid"
          v-if="success?.length === 0"
        >
          Upload
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useToast } from "vue-toastification";

type TProps = {
  accept?: string;
  multiple?: boolean;
  success?: {
    file: File;
    type: "success" | "fail" | "loading";
  }[];
};
const props = defineProps<TProps>();
const emits = defineEmits(["closeModal", "submitUpload"]);
const preview = ref("");
const file = ref<File | null>(null);
const files = ref<File[]>([]);
const toast = useToast();

function clearPreview() {
  preview.value = "";
  file.value = null;
}

const backgroundStyle = computed(() => {
  if (!preview.value) return {};

  if (file.value?.type.includes("image/")) {
    return { background: `url(${preview.value}) no-repeat center / cover` };
  } else if (file.value?.type === "application/pdf") {
    return {
      background: `url('/pdf-preview.webp') no-repeat center / cover`,
    };
  }

  return {
    background: `url('/default-preview.png') no-repeat center / 150px 150px`,
  };
});

watch(
  () => files.value,
  (newVal) => {
    if (newVal.length > 5) {
      toast.warning("Upload tối đa 5 files 1 lần!");
      files.value = newVal.slice(5);
    }
  }
);

const isValid = computed(() => {
  if (!file.value && files.value.length === 0) {
    return false;
  }
  return true;
});

function handleUpload() {
  if (!isValid.value) return;
  //đưa file ra ngoài
  emits("submitUpload", props.multiple ? files.value : file.value);
}

function handleClick() {
  //khi click thì tạo input và click vào
  const input = document.createElement("input");
  input.type = "file";
  if (props.multiple) {
    input.multiple = true;
  }
  if (props.accept) {
    input.accept = props.accept;
  }
  input.onchange = handleChange;
  input.click();
}

function handleDeletePreviewItem(i: number) {
  files.value = files.value.filter((item, index) => index !== i);
}

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const filesList = target.files;
  if (!filesList || filesList?.length === 0) return;
  if (!props.multiple) {
    //lưu file vào biến
    file.value = filesList[0];
    //đọc file để preview
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const imageUrl = e.target?.result as string;
      preview.value = imageUrl;
    };
    reader.readAsDataURL(file.value);
    return;
  } else {
    files.value = Array.from(filesList);
  }
}
</script>

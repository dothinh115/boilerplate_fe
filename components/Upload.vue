<template>
  <div class="space-y-2 xl:w-1/3 lg:w-1/2 md:w-3/4 w-[95%]">
    <div class="bg-gray-50 rounded-lg overflow-hidden">
      <div class="flex items-center justify-center w-full p-2 flex-wrap">
        <div
          @click="handleClick"
          class="flex flex-col items-center justify-center w-full cursor-pointer bg-gray-100 rounded-t-lg group p-6 md:h-[350px] h-[250px]"
          :style="backgroundStyle"
        >
          <div
            class="flex flex-col items-center justify-center pt-5 pb-6 space-y-4 w-3/4 rounded-lg group-hover:bg-gray-200 duration-200 border-2 border-gray-400 border-dashed"
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
      <div class="p-2 space-y-2">
        <div>
          <slot name="html" />
        </div>
        <button
          class="btn btn-green block w-full"
          @click="handleUpload"
          :disabled="!isValid"
        >
          Upload
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
type TProps = {
  accept?: string;
};
const props = defineProps<TProps>();
const emits = defineEmits(["closeModal", "submitUpload"]);
const preview = ref("");
const file = ref<File | null>(null);

function clearPreview() {
  preview.value = "";
  file.value = null;
}

const backgroundStyle = computed(() => {
  if (!preview.value) return {};

  if (file.value?.type.includes("image/")) {
    return { background: `url(${preview.value}) no-repeat center / cover` };
  } else if (file.value?.type === "application/pdf") {
    return { background: `url('/pdf-preview.webp') no-repeat center / cover` };
  } else
    return {
      background: `url('/default-preview.png') no-repeat center / 150px 150px`,
    };
});

const isValid = computed(() => {
  if (!file.value) {
    return false;
  }
  return true;
});

function handleUpload() {
  if (!isValid.value) return;
  //đưa file ra ngoài
  emits("submitUpload", file.value);
}

function handleClick() {
  //khi click thì tạo input và click vào
  const input = document.createElement("input");
  input.type = "file";
  if (props.accept) {
    input.accept = props.accept;
  }
  input.onchange = handleChange;
  input.click();
}

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files && files?.length > 0) {
    //lưu file vào biến
    file.value = files[0];
    console.log(file.value);
    //đọc file để preview
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const imageUrl = e.target?.result as string;
      preview.value = imageUrl;
    };
    reader.readAsDataURL(file.value);
  }
}
</script>

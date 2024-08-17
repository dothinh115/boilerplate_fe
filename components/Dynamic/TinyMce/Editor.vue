<template>
  <div>
    <DynamicTinyMceLoading v-if="!isTinyReady" />
    <div v-show="isTinyReady">
      <Editor :init="getEditorInit(data)" />
    </div>
    <Teleport to="body">
      <Modal
        v-model="uploadModal"
        :close-btn="true"
        @update:model-value="imgAlt = ''"
      >
        <Upload
          @close-modal="uploadModal = false"
          :accept="'image/*'"
          :submit-btn="false"
          @file-change="handleUploadImage"
          :message="'Chỉ được upload hình ảnh'"
        >
          <template #html>
            <div class="space-y-4">
              <div>
                <label for="img-input" class="text-xs text-gray-500 block">
                  Source
                </label>
                <input
                  id="img-input"
                  type="text"
                  class="input"
                  v-model="imgIdOrPath"
                  placeholder="Image source..."
                />
              </div>
              <div>
                <label for="alt-input" class="text-xs text-gray-500 block">
                  Alternative description
                </label>
                <input
                  id="alt-input"
                  type="text"
                  class="input"
                  v-model="imgAlt"
                  placeholder="Image alt..."
                />
              </div>
              <div class="grid grid-cols-2 gap-x-2">
                <div class="col-span-1">
                  <label for="img-width" class="text-xs text-gray-500 block">
                    Width
                  </label>
                  <input
                    id="img-width"
                    type="text"
                    class="input"
                    v-model="imgWidth"
                    placeholder="Image width..."
                  />
                </div>
                <div class="col-span-1">
                  <label for="img-height" class="text-xs text-gray-500 block">
                    Height
                  </label>
                  <input
                    id="img-height"
                    type="text"
                    class="input"
                    v-model="imgHeight"
                    placeholder="Image width..."
                  />
                </div>
              </div>
              <div class="flex space-x-2 justify-end">
                <button class="btn btn-red" @click="uploadModal = false">
                  Cancel
                </button>
                <button
                  class="btn btn-green"
                  @click="handleInsertImage"
                  :disabled="!imgIdOrPath"
                >
                  Submit
                </button>
              </div>
            </div>
          </template>
        </Upload>
      </Modal>
    </Teleport>
  </div>
</template>
<script setup lang="ts">
import "tinymce/plugins/autolink";
import "tinymce/plugins/lists";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/preview";
import "tinymce/plugins/code";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/media";
import "tinymce/plugins/table";
import Editor from "@tinymce/tinymce-vue";

type TProps = {
  disabled?: boolean;
  modelValue: string;
};

const props = withDefaults(defineProps<TProps>(), {
  disabled: false,
});

const tinyMceEditor = ref<any | null>(null);
const isTinyReady = ref(false);
const emits = defineEmits(["update:modelValue"]);
const uploadModal = ref(false);
const imgAlt = ref("");
const imgIdOrPath = ref("");
const imgWidth = ref(500);
const imgHeight = ref(500);
const { loading } = useGetState();
const data = ref<any>(props.modelValue);

function getEditorInit(item: string) {
  return {
    menubar: false,
    width: "100%",
    height: "350px",
    license_key: "gpl",
    plugins: "code table media link autolink fullscreen lists preview",
    content_style:
      "body { font-family:Poppins,sans-serif; font-size: 0.875rem }" +
      "body a { text-decoration:none }",
    toolbar:
      "undo redo | blocks | bold italic | fontsize | alignleft aligncenter alignright alignjustify | bullist numlist | table | customUploadButton | media link | code fullscreen | preview",
    mobile: {
      theme: "silver",
      plugins: "code table media link autolink fullscreen lists preview",
      toolbar_mode: "wrap",
      toolbar: props.disabled
        ? ""
        : "undo redo | blocks | bold italic | fontsize | alignleft aligncenter alignright alignjustify | bullist numlist | table | customUploadButton | media link | code fullscreen | preview",
    },
    toolbar_mode: "sliding",
    setup(editor: any) {
      editor.on("init", () => {
        if (item) {
          const html = useMarkdown().markdownToHtml(item);
          editor.setContent(html);
        }
        if (props.disabled) {
          editor.mode.set("readonly");
        }
        tinyMceEditor.value = editor;
        isTinyReady.value = true;
      });
      editor.on("change", () => {
        item = editor.getContent();
        const markdown = useMarkdown().htmlToMarkdown(item);
        emits("update:modelValue", markdown);
      });
      editor.ui.registry.addButton("customUploadButton", {
        icon: "image",
        onAction: function () {
          uploadModal.value = true;
        },
      });
    },
  };
}

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

async function handleInsertImage() {
  const isValid = isValidUrl(imgIdOrPath.value);
  if (isValid) {
    //nếu là url thì chèn thẳng vào editor
    tinyMceEditor.value?.insertContent(
      `<img src="${imgIdOrPath.value}" alt="${imgAlt.value}" alt="${
        imgAlt.value
      }"  ${imgWidth.value ? `width="${imgWidth.value}"` : ""} ${
        imgHeight.value ? `width="${imgHeight.value}"` : ""
      }/>`
    );
    imgIdOrPath.value = "";
    imgAlt.value = "";
    uploadModal.value = false;
  } else {
    //nếu là id trong hệ thống thì kiểm tra hợp lệ
    if (!imgIdOrPath.value) return;

    await useApi(`/asset/${imgIdOrPath.value}`);
    tinyMceEditor.value?.insertContent(
      `<img src="/api/asset/${imgIdOrPath.value}?format=webp${
        imgWidth.value ? `&width=${imgWidth.value}` : ""
      }${imgHeight.value ? `&height=${imgHeight.value}` : ""}" alt="${
        imgAlt.value
      }" ${imgWidth.value ? `width="${imgWidth.value}"` : ""} ${
        imgHeight.value ? `width="${imgHeight.value}"` : ""
      } />`
    );

    imgIdOrPath.value = "";
    imgAlt.value = "";
    uploadModal.value = false;
  }
}

async function handleUploadImage(file: File) {
  if (file) {
    loading.value = true;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const newFile = await useApi("/file", {
        method: "POST",
        body: formData,
      });
      if (newFile.data) {
        const img = newFile.data;
        imgIdOrPath.value = img.id;
      }
      loading.value = false;
    } catch (error: any) {
      imgIdOrPath.value = error.data.fileId;
    }
  }
}
</script>
<style scoped lang="scss">
textarea {
  @apply hidden;
}
</style>
<style lang="scss">
.tox.tox-tinymce {
  @apply rounded-md ring-gray-300 sm:text-sm border-0 shadow-sm;
}

.tox.tox-tinymce.tox-edit-focus .tox-edit-area {
  @apply before:border-none;
}

.tox.tox-tinymce .tox-editor-container {
  @apply shadow-none;
}

.tox.tox-tinymce .tox-statusbar__right-container {
  @apply hidden;
}

.tox.tox-tinymce
  .tox-editor-container
  .tox-editor-header
  .tox-toolbar-overlord
  .tox-toolbar__primary {
  & .tox-toolbar__group {
    @apply border-r border-gray-100;
  }
}
</style>

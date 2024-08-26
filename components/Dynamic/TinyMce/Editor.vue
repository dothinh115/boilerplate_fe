<template>
  <div>
    <DynamicTinyMceLoading v-if="!isTinyReady" />
    <div
      v-show="isTinyReady"
      ref="editorEl"
      class="relative rounded-md"
      :class="{
        'ring-2 ring-red-600': error,
      }"
    >
      <Editor api-key="no-api-key" :init="getEditorInit(data)" />
      <div
        class="w-[200px] absolute z-10 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden"
        :style="{
          top: mentionPosition?.top + 'px',
          left: mentionPosition?.left + 'px',
        }"
        v-if="isMentioning && mentionList.length > 0"
      >
        <ul class="divide-y divide-gray-200">
          <li
            v-for="(item, index) in mentionList"
            :key="index"
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            @click="handleMention(item)"
            :class="{
              'bg-gray-100': index === selectedIndex,
            }"
          >
            {{ item.username }}
          </li>
        </ul>
      </div>
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
import Editor from "@tinymce/tinymce-vue";
import "@/public/tinymce/plugins/lists/plugin.min";
import "@/public/tinymce/plugins/link/plugin.min";
import "@/public/tinymce/plugins/image/plugin.min";
import "@/public/tinymce/plugins/autolink/plugin.min";
import "@/public/tinymce/plugins/preview/plugin.min";
import "@/public/tinymce/plugins/code/plugin.min";
import "@/public/tinymce/plugins/fullscreen/plugin.min";
import "@/public/tinymce/plugins/media/plugin.min";
import "@/public/tinymce/plugins/table/plugin.min";

type TProps = {
  disabled?: boolean;
  modelValue: string;
  error: string | undefined;
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
const { startLoading, finishLoading } = useLoading();
const data = ref<any>(props.modelValue);
const editorEl = ref<HTMLDivElement | null>(null);
const mentionList = ref<TUser[]>([]);
const isMentioning = ref(false);
const mentionPosition = ref<{ top: number; left: number } | null>(null);
let mentionText = "";
let selectedIndex = ref(0);
let cursorPosition: any = null;

let timeout: any = null;

function getEditorInit(item: string) {
  return {
    menubar: false,
    width: "100%",
    height: "350px",
    license_key: "gpl",
    plugins: "code lists table media link fullscreen preview autolink",
    autolink_pattern: /^(https?:\/\/|ssh:\/\/|ftp:\/\/|file:\/|www\.)(.+)$/i,
    content_style:
      "body { font-family:Poppins,sans-serif; font-size: 0.875rem }" +
      "body a { text-decoration:none }" +
      "body.mce-content-readonly {opacity: 50%}",
    toolbar:
      "undo redo | blocks | bold italic | fontsize | alignleft aligncenter alignright alignjustify | bullist numlist | table | customUploadButton | media link | code fullscreen | preview",
    mobile: {
      menubar: false,
      toolbar_mode: "sliding",
      toolbar:
        "undo redo | blocks | bold italic | fontsize | alignleft aligncenter alignright alignjustify | bullist numlist | table | customUploadButton | media link | code fullscreen | preview",
    },
    toolbar_mode: "sliding",
    setup(editor: typeof Editor) {
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
      editor.on("input", () => {
        if (timeout) timeout = clearTimeout(timeout);
        timeout = setTimeout(() => handleGetMention(editor), 250);
      });
      editor.on("keyDown", (event: KeyboardEvent) => {
        if (isMentioning.value) {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            selectedIndex.value =
              (selectedIndex.value + 1) % mentionList.value.length;
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            selectedIndex.value =
              (selectedIndex.value - 1 + mentionList.value.length) %
              mentionList.value.length;
          } else if (event.key === "Enter") {
            event.preventDefault();
            handleMention(mentionList.value[selectedIndex.value]);
          }
        }
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

async function handleGetMention(editor: typeof Editor) {
  const {
    isMentioning: mention,
    mentionText: text,
    cursorPosition: cursor,
  } = useMention(editor);

  if (mention) {
    cursorPosition = cursor;
    //lưu mentionText vào 1 biến nào đó
    if (mentionText !== text.trim()) {
      mentionText = text;
      const params = {
        [`filter[username][_contains]`]: mentionText,
      };
      const response = await useApi("/user", { params });
      mentionList.value = response.data;
      const selectionRect = editor.selection.getRng().getBoundingClientRect();
      const editorRect = editorEl.value?.getBoundingClientRect();
      const headerHeight =
        editorEl.value?.querySelector(".tox-editor-header")?.clientHeight || 0;
      const currentBlock = getCurrentBlockNode(editor);
      const currentBlockHeight = currentBlock.clientHeight || 0;
      if (editorRect) {
        mentionPosition.value = {
          top: selectionRect.top + currentBlockHeight + headerHeight,
          left: selectionRect.left,
        };
      }
    }
  }
  isMentioning.value = mention;
}

function handleMention(user: TUser) {
  const editor = tinyMceEditor.value;
  if (!editor) return;

  // Lấy block hiện tại
  const blockElement = getCurrentBlockNode(editor);
  if (!blockElement) return;

  const blockHtml = blockElement.innerHTML || "";

  const { start, end } = cursorPosition;
  const htmlBeforeCursor = blockHtml.slice(0, start);
  const htmlAfterCursor = blockHtml.slice(end);

  // Tạo phần văn bản mới bằng cách thay thế mentionText bằng user.email
  const newText = htmlBeforeCursor + `@${user.username} ` + htmlAfterCursor;

  // Cập nhật nội dung của block
  blockElement.innerHTML = newText;
  const newBlockElement = getCurrentBlockNode(editor);
  // Khôi phục vị trí con trỏ
  const range = document.createRange();
  range.setStart(newBlockElement.firstChild, start + user.username.length + 2);
  range.setEnd(newBlockElement.firstChild, start + user.username.length + 2);

  editor.selection.setRng(range);
  editor.focus();
  isMentioning.value = false;
}

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

function getCurrentBlockNode(editor: typeof Editor) {
  const node = editor.selection.getNode();
  let blockNode = node;
  while (blockNode && !editor.dom.isBlock(blockNode)) {
    blockNode = blockNode.parentNode;
  }
  return blockNode;
}

watch(isMentioning, (newVal) => {
  if (!newVal) {
    mentionPosition.value = null;
    mentionText = "";
    cursorPosition = null;
  }
});

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
    startLoading();
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
    } catch (error: any) {
      imgIdOrPath.value = error.data.fileId;
    } finally {
      finishLoading();
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

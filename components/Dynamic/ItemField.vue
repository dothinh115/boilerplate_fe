<template>
  <div
    :class="{
      'flex items-center space-x-4': $typeCheck(data) === 'boolean',
      'space-y-1': $typeCheck(data) !== 'boolean',
    }"
  >
    <div class="text-gray-900">{{ field }}:</div>
    <Editor
      api-key="ybvcxe9fj0sj6lcp90640iyvqe3epn8hz97d8hr0j8ad0g0h"
      :init="getEditorInit(field)"
      v-if="value.richText"
      v-model="data"
    />

    <div v-else-if="$typeCheck(data) === 'boolean'">
      <Toggle v-model="data" />
    </div>
    <div
      class="flex space-x-2"
      v-else-if="
        $typeCheck(data) === 'string' ||
        $typeCheck(data) === 'number' ||
        $typeCheck(data) === null ||
        $typeCheck(data) === 'Array'
      "
    >
      <input
        :type="
          $typeCheck(data) === 'number'
            ? 'number'
            : field === 'password'
            ? 'password'
            : 'text'
        "
        class="input w-full"
        :class="{
          'input-red': error[field],
          'input-blue': !error[field],
        }"
        :disabled="
          field === '_id' || field === 'slug'
            ? true
            : props.new
            ? false
            : user.rootUser
            ? false
            : value.disabled
            ? true
            : false
        "
        :value="data ? data : ''"
        @input="updateData(field, $event.target as HTMLInputElement)"
        v-if="!value.ref"
      />
      <div
        class="flex flex-wrap"
        v-else-if="(value.ref && data) || $typeCheck(data) === 'Array'"
        v-if="
          ($typeCheck(data) === 'Array' && data.length > 0) ||
          ($typeCheck(data) !== 'Array' && data)
        "
      >
        <div
          v-if="$typeCheck(data) === 'Array'"
          v-for="(item, index) in data"
          :key="index"
          class="flex items-center justify-center mr-2 mb-2"
        >
          <div
            class="bg-indigo-700 text-gray-50 p-1 min-w-[35px] max-w-[100px] h-[30px] flex items-center justify-center rounded-l-[5px]"
            :class="{
                'rounded-r-[5px]': !$roleCheck('patch', route.params.post as string),
              }"
          >
            <p class="truncate">{{ item }}</p>
          </div>
          <button
            class="bg-indigo-300 h-[30px] flex items-center justify-center text-gray-800 px-2 rounded-r-[5px] lg:hover:bg-red-600 lg:hover:text-white duration-200"
            @click="handleRemoveFromArray(field, item)"
            v-if="$roleCheck('patch', route.params.post as string)"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div v-else class="flex items-center">
          <div
            class="bg-indigo-700 text-gray-50 p-1 min-w-[35px] max-w-[100px] h-[30px] flex items-center justify-center rounded-l-[5px]"
            :class="{
                'rounded-r-[5px]': !$roleCheck('patch', route.params.post as string),
              }"
          >
            <p class="truncate">{{ data }}</p>
          </div>
          <button
            class="bg-indigo-300 h-[30px] flex items-center justify-center text-gray-800 px-2 rounded-r-[5px] lg:hover:bg-red-600 lg:hover:text-white duration-200"
            @click="handleRemoveFromField(field)"
            v-if="$roleCheck('patch', route.params.post as string)"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
      <button
        class="bg-teal-700 h-[30px] aspect-1 rounded-[5px] flex items-center justify-center text-gray-50 text-[24px] lg:hover:bg-teal-500 duration-200"
        :class="{
          'mb-2': $typeCheck(data) === 'Array',
        }"
        v-if="value.ref && $roleCheck('patch', route.params.post as string)"
        @click.stop="value.ref && handleRef(value.ref, value.type, data, field)"
      >
        <i class="fa-solid fa-up-right-from-square"></i>
      </button>
    </div>
    <div v-if="error[field]" class="text-[12px] text-red-600">
      {{ error[field] }}
    </div>
  </div>
</template>
<script setup lang="ts">
import Editor from "@tinymce/tinymce-vue";

type TProps = {
  field: string;
  value: any;
  item: any;
  error: any;
  new?: boolean;
};
const { user } = useAuth();
const props = defineProps<TProps>();
const emits = defineEmits(["updateData", "handleRef"]);
const route = useRoute();
const data = ref(props.item);

function getEditorInit(item: string) {
  return {
    menubar: false,
    width: "100%",
    height: "350px",
    toolbar:
      "styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist",
    setup(editor: any) {
      editor.on("init", () => {
        if (item) editor.setContent(item);
      });
      editor.on("input", () => {
        item = editor.getContent();
      });
    },
  };
}

function updateData(item: string, target: HTMLInputElement) {
  emits("updateData", { item, target });
}

function handleRef(
  ref: string,
  type: "text" | "number" | "array",
  defaultValue: string | number | string[] | number[],
  key: string
) {
  emits("handleRef", { ref, type, defaultValue, key });
}

function handleRemoveFromArray(field: string, item: string | number) {
  data.value = (data.value[field] as Array<string | number>).filter(
    (x) => x !== item
  );
}

function handleRemoveFromField(field: string) {
  data.value[field] = null;
}
</script>

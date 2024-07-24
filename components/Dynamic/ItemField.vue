<template>
  <div
    :class="{
      'flex items-center space-x-4': $typeCheck(data) === 'boolean',
      'space-y-1': $typeCheck(data) !== 'boolean',
    }"
  >
    <div class="text-gray-900">{{ schemaKey }}:</div>
    <Editor
      api-key="ybvcxe9fj0sj6lcp90640iyvqe3epn8hz97d8hr0j8ad0g0h"
      :init="getEditorInit(data)"
      v-if="schemaValue.type === 'richText'"
      v-model="data"
    />

    <div v-else-if="$typeCheck(data) === 'boolean'">
      <Toggle v-model="data" :disabled="schemaValue.disabled" />
    </div>
    <div
      class="flex space-x-2"
      v-else-if="
        $typeCheck(data) === 'string' ||
        $typeCheck(data) === 'number' ||
        $typeCheck(data) === null ||
        $typeCheck(data) === 'array'
      "
    >
      <input
        :type="
          $typeCheck(data) === 'number'
            ? 'number'
            : schemaKey === 'password'
            ? 'password'
            : 'text'
        "
        class="input w-full"
        :class="{
          'input-red': error[schemaKey],
          'input-blue': !error[schemaKey],
        }"
        :disabled="
          schemaKey === 'id' || schemaKey === 'slug'
            ? true
            : props.new
            ? false
            : schemaValue.disabled
            ? true
            : false
        "
        v-model="data"
        @input="updateData(schemaKey, $event.target as HTMLInputElement)"
        v-if="!schemaValue.relation"
      />
      <div
        class="flex flex-wrap"
        v-else-if="
          (schemaValue.relation && data) || $typeCheck(data) === 'array'
        "
        v-if="
          ($typeCheck(data) === 'array' && data.length > 0) ||
          ($typeCheck(data) !== 'array' && data)
        "
      >
        <div
          v-if="$typeCheck(data) === 'array'"
          v-for="(item, index) in item"
          :key="index"
          class="flex items-center justify-center mr-2 mb-2"
        >
          <div
            class="bg-indigo-700 text-gray-50 p-1 min-w-[35px] max-w-[100px] h-[30px] flex items-center justify-center rounded-l-[5px]"
            :class="{
                'rounded-r-[5px]': !$roleCheck('PATCH', route.params.post as string),
              }"
          >
            <p class="truncate">{{ item }}</p>
          </div>
          <button
            class="bg-indigo-300 h-[30px] flex items-center justify-center text-gray-800 px-2 rounded-r-[5px] lg:hover:bg-red-600 lg:hover:text-white duration-200"
            @click="handleRemoveFromArray(schemaKey, item)"
            v-if="$roleCheck('PATCH', route.params.post as string)"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div v-else class="flex items-center">
          <div
            class="bg-indigo-700 text-gray-50 p-1 min-w-[35px] max-w-[100px] h-[30px] flex items-center justify-center rounded-l-[5px]"
            :class="{
                'rounded-r-[5px]': !$roleCheck('PATCH', route.params.post as string),
              }"
          >
            <p class="truncate">{{ data }}</p>
          </div>
          <button
            class="bg-indigo-300 h-[30px] flex items-center justify-center text-gray-800 px-2 rounded-r-[5px] lg:hover:bg-red-600 lg:hover:text-white duration-200"
            @click="handleRemoveFromField(schemaKey)"
            v-if="$roleCheck('PATCH', route.params.post as string)"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
      <button
        class="bg-teal-700 h-[30px] aspect-1 rounded-[5px] flex items-center justify-center text-gray-50 text-[24px] lg:hover:bg-teal-500 duration-200"
        :class="{
          'mb-2': $typeCheck(data) === 'array',
        }"
        v-if="schemaValue.relation && $roleCheck('PATCH', route.params.post as string)"
        @click.stop="
          schemaValue.relation &&
            handleRelation(
              schemaValue.relation,
              schemaValue.type,
              data,
              schemaKey
            )
        "
      >
        <i class="fa-solid fa-up-right-from-square"></i>
      </button>
    </div>
    <div v-if="error[schemaKey]" class="text-[12px] text-red-600">
      {{ error[schemaKey] }}
    </div>
  </div>
</template>
<script setup lang="ts">
import Editor from "@tinymce/tinymce-vue";

type TProps = {
  schemaKey: string;
  schemaValue: any;
  item: any;
  error: any;
  new?: boolean;
};
const props = defineProps<TProps>();
const emits = defineEmits(["updateData", "handleRef", "updateDataField"]);
const route = useRoute();
const data = ref(props.item);

watch(
  () => props.item,
  (newValue) => {
    data.value = newValue;
  }
);

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
        emits("updateDataField", { field: props.schemaKey, value: item });
      });
    },
  };
}

function updateData(item: string, target: HTMLInputElement) {
  emits("updateData", { item, target });
}

function handleRelation(
  relation: string,
  type: "text" | "number" | "array",
  defaultValue: string | number | string[] | number[],
  key: string
) {
  emits("handleRef", { relation, type, defaultValue, key });
}

function handleRemoveFromArray(field: string, item: string | number) {
  data.value = data.value.filter((x: string | number) => x !== item);
  emits("updateDataField", { field, value: data.value });
}

function handleRemoveFromField(field: string) {
  data.value = null;
  emits("updateDataField", { field, value: null });
}
</script>

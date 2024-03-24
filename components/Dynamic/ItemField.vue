<template>
  <template v-for="(field, index) in Object.keys(schema)" :key="index">
    <div
      :class="{
        'flex items-center space-x-4': schema[field].input === 'boolean',
        'space-y-1': schema[field].input !== 'boolean',
      }"
    >
      <div class="text-gray-900">{{ field }}:</div>
      <Editor
        api-key="ybvcxe9fj0sj6lcp90640iyvqe3epn8hz97d8hr0j8ad0g0h"
        :init="getEditorInit(field)"
        :width="'100%'"
        v-if="schema[field].input === 'richText'"
      />
      <div
        class="flex items-center space-x-2"
        v-else-if="
          schema[field].input === 'text' ||
          schema[field].input === 'number' ||
          schema[field].input === 'password' ||
          schema[field].input === 'email'
        "
      >
        <input
          :type="
            schema[field].input === 'number'
              ? 'number'
              : schema[field].input === 'password'
              ? 'password'
              : schema[field].input === 'password'
              ? 'email'
              : 'text'
          "
          class="input w-full"
          :class="{
            'input-red': error[field],
            'input-blue': !error[field],
          }"
          :disabled="
            field === '_id'
              ? true
              : user.rootUser
              ? false
              : schema[field].disabled || schema[field].ref
              ? true
              : false
          "
          :value="data ? data[field] : ''"
          @input="updateData(field, $event.target as HTMLInputElement)"
          v-if="!schema[field].ref"
        />
        <div
          :key="index"
          class="flex items-center justify-center"
          v-else-if="schema[field].ref && data[field]"
        >
          <div
            class="bg-indigo-700 text-gray-50 p-1 min-w-[35px] max-w-[100px] h-[30px] flex items-center justify-center rounded-l-[5px]"
          >
            <p class="truncate">{{ data[field] }}</p>
          </div>
          <button
            class="bg-indigo-300 h-[30px] flex items-center justify-center text-gray-800 px-2 rounded-r-[5px]"
            @click="handleRemoveFromField(field)"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <button
          class="bg-teal-700 h-[30px] aspect-1 rounded-[5px] flex items-center justify-center text-gray-50 text-[24px]"
          v-if="schema[field].ref"
          @click="
            schema[field].ref &&
              handleRef(
                schema[field].ref,
                schema[field].input,
                data[field],
                field
              )
          "
        >
          <i class="fa-solid fa-up-right-from-square"></i>
        </button>
      </div>
      <div v-else-if="schema[field].input === 'boolean'">
        <select
          v-model="data[field]"
          class="input"
          :class="{
            'input-red': error[field],
            'input-blue': !error[field],
          }"
        >
          <option :value="true">True</option>
          <option :value="false">False</option>
        </select>
      </div>

      <div
        v-else-if="schema[field].input === 'array'"
        class="flex flex-wrap h-fit"
      >
        <div
          v-for="(item, index) in data[field]"
          :key="index"
          class="flex items-center justify-center mr-2 mb-2"
        >
          <div
            class="bg-indigo-700 text-gray-50 p-1 min-w-[35px] max-w-[100px] h-[30px] flex items-center justify-center rounded-l-[5px]"
          >
            <p class="truncate">{{ item }}</p>
          </div>
          <button
            class="bg-indigo-300 h-[30px] flex items-center justify-center text-gray-800 px-2 rounded-r-[5px]"
            @click="handleRemoveFromArray(field, item)"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <button
          class="bg-teal-700 h-[30px] aspect-1 rounded-[5px] flex items-center justify-center text-gray-50 text-[24px]"
          v-if="schema[field].ref"
          @click="
            schema[field].ref &&
              handleRef(
                schema[field].ref,
                schema[field].input,
                data[field],
                field
              )
          "
        >
          <i class="fa-solid fa-up-right-from-square"></i>
        </button>
      </div>
    </div>
  </template>
</template>
<script setup lang="ts">
import Editor from "@tinymce/tinymce-vue";

type TProps = {
  schema: any;
  data: any;
  error: any;
};
const { user } = useAuth();
const props = defineProps<TProps>();
const emits = defineEmits(["updateData", "handleRef"]);

function getEditorInit(item: string) {
  return {
    menubar: false,
    plugins: "lists link image emoticons",
    toolbar:
      "styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist | link image emoticons",
    setup(editor: any) {
      editor.on("init", () => {
        if (props.data[item]) editor.setContent(props.data[item]);
      });
      editor.on("input", () => {
        props.data[item] = editor.getContent();
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
  props.data[field] = (props.data[field] as Array<string | number>).filter(
    (x) => x !== item
  );
}

function handleRemoveFromField(field: string) {
  props.data[field] = null;
}
</script>

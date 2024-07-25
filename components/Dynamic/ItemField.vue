<template>
  <div
    :class="{
      'flex items-center space-x-4': $typeCheck(data) === 'boolean',
      'space-y-1': $typeCheck(data) !== 'boolean',
    }"
  >
    <div class="text-gray-900">{{ localSchemaKey }}:</div>
    <Editor
      api-key="ybvcxe9fj0sj6lcp90640iyvqe3epn8hz97d8hr0j8ad0g0h"
      :init="getEditorInit(data)"
      v-if="localSchemaValue.type === 'richText'"
      v-model="data"
    />

    <div v-else-if="$typeCheck(data) === 'boolean'">
      <Toggle v-model="data" :disabled="localSchemaValue.disabled" />
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
            : localSchemaKey === 'password'
            ? 'password'
            : 'text'
        "
        class="input w-full"
        :class="{
          'input-red': error[localSchemaKey],
          'input-blue': !error[localSchemaKey],
        }"
        :disabled="
          localSchemaKey === 'id' || localSchemaKey === 'slug'
            ? true
            : props.new
            ? false
            : localSchemaValue.disabled
            ? true
            : false
        "
        v-model="data"
        @input="updateData(localSchemaKey, $event.target as HTMLInputElement)"
        v-if="!localSchemaValue.relation"
      />
      <div
        class="flex flex-wrap"
        v-else-if="
          (localSchemaValue.relation && data) || $typeCheck(data) === 'array'
        "
        v-if="
          ($typeCheck(data) === 'array' && data.length > 0) ||
          ($typeCheck(data) !== 'array' && data)
        "
      >
        <div
          v-if="$typeCheck(data) === 'array'"
          v-for="(item, index) in data"
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
            @click="handleRemoveFromArray(item)"
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
            @click="handleRemoveFromField()"
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
        v-if="localSchemaValue.relation && $roleCheck('PATCH', route.params.post as string)"
        @click.stop="
          localSchemaValue.relation &&
            handleRelation(
              localSchemaValue.relation,
              localSchemaValue.type,
              data,
              localSchemaKey
            )
        "
      >
        <i class="fa-solid fa-up-right-from-square"></i>
      </button>
      <button
        class="bg-teal-700 h-[39px] aspect-1 rounded-[5px] flex items-center justify-center text-gray-50 text-[16px] lg:hover:bg-teal-500 duration-200"
        v-if="
          localSchemaValue.disabled &&
          localSchemaKey !== 'id' &&
          !localSchemaValue.relation &&
          user.rootUser
        "
        @click="handleUnDisabled()"
      >
        <i class="fa-solid fa-lock-open"></i>
      </button>
    </div>
    <div v-if="error[localSchemaKey]" class="text-[12px] text-red-600">
      {{ error[localSchemaKey] }}
    </div>
  </div>
</template>
<script setup lang="ts">
import Editor from "@tinymce/tinymce-vue";

type TProps = {
  schemaKey: string;
  schemaValue: any;
  modelValue: any;
  error: any;
  new?: boolean;
};
const props = defineProps<TProps>();
const emits = defineEmits(["updateData", "handleRef", "update:modelValue"]);
const route = useRoute();
const data = ref(props.modelValue);
const localSchemaKey = ref(props.schemaKey);
const localSchemaValue = ref({ ...props.schemaValue });
const { user } = useAuth();

watch(
  () => props.modelValue,
  (newVal) => {
    data.value = newVal;
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
      editor.on("change", () => {
        item = editor.getContent();
        emits("update:modelValue", item);
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

function handleRemoveFromArray(item: string | number) {
  emits(
    "update:modelValue",
    data.value.filter((x: string | number) => x !== item)
  );
}

function handleRemoveFromField() {
  emits("update:modelValue", null);
}

function handleUnDisabled() {
  localSchemaValue.value.disabled = false;
}
</script>

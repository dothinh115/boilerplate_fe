<template>
  <div
    :class="{
      'flex items-center space-x-4': schemaValue.type === 'boolean',
      'space-y-1': schemaValue.type !== 'boolean',
    }"
  >
    <label :for="localSchemaKey" class="text-gray-900 block"
      >{{ localSchemaKey }}:</label
    >
    <DynamicTinyMceEditor
      v-if="localSchemaValue.type === 'richText'"
      :disabled="schemaValue.disabled"
      v-model="data"
    />

    <div
      v-else-if="schemaValue.type === 'boolean'"
      class="flex items-center justify-between w-full h-[39px]"
    >
      <Toggle v-model="data" :disabled="localSchemaValue.disabled" />
      <button
        class="bg-teal-700 h-[39px] aspect-1 rounded-[5px] flex items-center justify-center text-gray-50 text-[16px] lg:hover:bg-teal-500 duration-200"
        v-if="isShowLockedButton"
        @click="handleUnLock()"
      >
        <i class="fa-solid fa-lock-open"></i>
      </button>
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
          localSchemaKey === 'password' ? 'password' : localSchemaValue.type
        "
        :id="localSchemaKey"
        class="input w-full"
        :class="{
          'input-error': error[localSchemaKey],
        }"
        :disabled="isFieldDisabled"
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
        class="bg-teal-700 h-[30px] aspect-1 rounded-[5px] flex items-center justify-center text-gray-50 text-[24px] duration-200"
        :class="{
          'mb-2': $typeCheck(data) === 'array',
          'opacity-50': !$roleCheck('PATCH', route.params.post as string),
          'lg:hover:bg-teal-500': $roleCheck('PATCH', route.params.post as string)
        }"
        v-if="localSchemaValue.relation"
        @click.stop="
          localSchemaValue.relation &&
            $roleCheck('PATCH', route.params.post as string) &&
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
        v-if="isShowLockedButton"
        @click="handleUnLock()"
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
const isTinyReady = ref(false);
const { $roleCheck } = useNuxtApp();

watch(
  () => props.modelValue,
  (newVal) => {
    data.value = newVal;
  }
);

watch(
  () => data.value,
  (newVal) => emits("update:modelValue", newVal)
);

const isFieldDisabled = computed(() => {
  if (
    !$roleCheck("PATCH", route.params.post as string) ||
    localSchemaValue.value.disabled ||
    localSchemaValue.value.autoGenerated ||
    localSchemaKey.value === "id"
  )
    return true;
  return false;
});

const isShowLockedButton = computed(() => {
  if (
    localSchemaValue.value.disabled &&
    localSchemaKey.value !== "id" &&
    !props.new &&
    !localSchemaValue.value.relation &&
    user.value.rootUser
  )
    return true;
  return false;
});

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

function handleUnLock() {
  localSchemaValue.value.disabled = false;
}
</script>

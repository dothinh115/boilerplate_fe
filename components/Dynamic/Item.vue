<template>
  <div
    class="space-y-8 xl:w-[60%] lg:w-[80%] md:w-[95%] w-full mx-auto flex items-center max-md:min-h-[100dvh] flex-col"
  >
    <div
      class="md:rounded-[10px] md:max-h-[95dvh] max-h-[100dvh] overflow-y-auto hidden-scrollbar relative w-full flex-grow flex flex-col"
    >
      <div
        class="flex items-center justify-between space-x-2 title sticky top-0 z-[1000] bg-white shadow-md flex-shrink-0"
      >
        <i
          class="fa-solid fa-arrow-left-long cursor-pointer bg-white p-2 rounded-full text-indigo-600 lg:hover:bg-indigo-900 lg:hover:text-white transition duration-200"
          @click="handleClose"
        ></i>

        <div class="flex items-center space-x-2 h-full">
          <i
            class="fa-solid fa-trash cursor-pointer bg-white p-2 rounded-full text-red-600 lg:hover:bg-red-600 transition duration-200 h-[36px] w-[36px] flex justify-center items-center lg:hover:text-white"
            @click="deleteConfirmModal = true"
            v-if="data.id && $roleCheck('DELETE', route.params.post as string)"
          ></i>
          <i
            class="fa-solid fa-check cursor-pointer bg-white p-2 rounded-full text-teal-600 lg:hover:bg-teal-900 transition duration-200 h-[36px] w-[36px] flex justify-center items-center lg:hover:text-white"
            @click="handleConfirm"
            v-if="
                (data.id && $roleCheck('PATCH', route.params.post as string)) ||
                (!data.id && $roleCheck('POST', route.params.post as string))
              "
          ></i>
        </div>
      </div>
      <div class="p-4 space-y-5 bg-gray-100 flex-grow">
        <DynamicItemField
          v-for="([schemaKey, schemaValue], index) in Object.entries(schema)"
          :key="index"
          v-model="data[schemaKey]"
          :error
          @updateData="updateData"
          @handleRef="handleRelation"
          :new
          :schemaKey
          :schemaValue
        />
      </div>
    </div>
  </div>

  <Confirm
    :message="'Bạn có chắc chắn muốn xoá không?'"
    :handle="handleDelete"
    v-model="deleteConfirmModal"
  >
    <template #icon>
      <i class="fa-solid fa-circle-exclamation text-[48px] text-red-600"></i>
    </template>
  </Confirm>

  <Teleport to="body">
    <Modal v-model="selectModal">
      <DynamicSelectList
        :relationData="relationData"
        @close="selectModal = false"
        @confirm="handleSelection"
        v-if="relationData"
      />
    </Modal>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from "vue-toastification";

type TProps = {
  schema: any;
  new?: boolean;
  itemData?: any;
};
const excludedKey = ["password", "id", "slug"];
const route = useRoute();
const props = defineProps<TProps>();
const emits = defineEmits(["close"]);
const router = useRouter();
const schema = ref<any>(props.schema);
const data = ref<any>(props.itemData || {});
const error = ref<{
  [key: string]: string;
}>({});
const deleteConfirmModal = ref(false);
const selectModal = ref(false);
const toast = useToast();
const relationData = ref<{
  relation: string;
  type: "string" | "number" | "array" | undefined;
  defaultValue: string | number | string[] | number[];
  key: string;
}>();
const { shouldRevalidate } = useGetState();

if (Object.keys(data.value).length === 0) {
  for (const key in schema.value) {
    if (schema.value[key].default !== undefined) {
      data.value[key] = schema.value[key].default;
    } else if (key !== "id") data.value[key] = "";
  }
}

const isValid = computed(() => {
  for (const [key, value] of Object.entries(schema.value)) {
    if (excludedKey.includes(key) || data.value[key] === 0) continue;
    if ((value as any).required) {
      if (
        data.value[key] === undefined ||
        data.value[key] === null ||
        data.value[key] === ""
      ) {
        return false;
      }
    }
  }
  return true;
});

function updateData(object: { item: string; target: HTMLInputElement }) {
  const value = object.target.value;
  data.value[object.item] = value;
}

function errorCheck() {
  for (const [key, value] of Object.entries(schema.value)) {
    if ((value as any).required) {
      if (excludedKey.includes(key) || data.value[key] === 0) continue;
      if (
        data.value[key] === undefined ||
        data.value[key] === null ||
        data.value[key] === ""
      ) {
        error.value[key] = "Không được để trống!";
      } else error.value[key] = "";
    }
  }
}

async function handleConfirm() {
  errorCheck();
  if (!isValid.value) return;
  try {
    await useApi(
      `/${route.params.post}${data.value.id ? "/" + data.value.id : ""}`,
      {
        method: data.value.id ? "PATCH" : "POST",
        body: data.value,
      }
    );
    toast.success("Thành công");
    shouldRevalidate.value = true;
    router.back();
  } catch (error: any) {
    toast.error(error?.data.message);
  }
}

async function handleDelete() {
  if (!data.value) return;
  try {
    await useApi(`/${route.params.post}/${data.value.id}`, {
      method: "DELETE",
    });

    toast.success("Thành công");
    shouldRevalidate.value = true;
    router.back();
  } catch (error: any) {
    toast.error(error?.data.message);
  }
}

function handleRelation(object: {
  relation: string;
  type: "string" | "number" | "array" | undefined;
  defaultValue: string | number | string[] | number[];
  key: string;
}) {
  selectModal.value = true;
  let { relation, type, defaultValue, key } = object;
  relation = relation.toLowerCase();
  relationData.value = {
    relation,
    type,
    defaultValue,
    key,
  };
}

function handleClose() {
  emits("close");
}

function handleSelection({
  selected,
  key,
}: {
  selected: { id: string | number } | { id: string | number }[];
  key: string;
}) {
  if (Array.isArray(selected)) {
    data.value[key] = selected.map((x) => x.id);
  } else data.value[key] = selected.id || null;
}
</script>

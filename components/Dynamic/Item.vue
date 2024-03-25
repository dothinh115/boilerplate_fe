<template>
  <Teleport to="body">
    <Modal v-model="showModal" @update:model-value="showModal = false">
      <div
        class="space-y-8 lg:w-[50%] md:w-[60%] w-[95%] mx-auto max-h-full rounded-[10px] h-full flex items-center"
      >
        <div
          class="rounded-[10px] max-h-full overflow-y-scroll hidden-scrollbar relative w-full"
        >
          <div
            class="flex items-center justify-between space-x-2 title !py-2 sticky top-0 z-[1000]"
          >
            <i
              class="fa-solid fa-arrow-left-long cursor-pointer bg-white p-2 rounded-full text-indigo-600"
              @click="
                router.replace({
                  name: 'route-pre-post',
                  params: {
                    ...(route.params.post
                      ? {
                          pre: route.params.pre,
                          post: route.params.post,
                        }
                      : {
                          pre: route.params.pre,
                        }),
                  },
                  query: {
                    ...route.query,
                  },
                })
              "
            ></i>

            <div class="flex items-center space-x-2">
              <i
                class="fa-solid fa-trash cursor-pointer bg-white p-2 rounded-full text-red-600"
                @click="deleteConfirmModal = true"
                v-if="data._id"
              ></i>
              <i
                class="fa-solid fa-check cursor-pointer bg-white p-2 rounded-full text-teal-600"
                @click="handleConfirm"
              ></i>
            </div>
          </div>
          <div class="p-4 space-y-5 bg-gray-100 max-h-full">
            <DynamicItemField
              :schema="schema"
              :data="data"
              :error="error"
              @updateData="updateData"
              @handleRef="handleRef"
            />
          </div>
        </div>
      </div>
    </Modal>
  </Teleport>
  <DeleteConfirm
    :handle="handleDelete"
    v-model="deleteConfirmModal"
    @update:model-value="deleteConfirmModal = false"
  />
  <DynamicSelect
    :refData="refData"
    v-if="refData"
    @close="refData = undefined"
    @confirm="handleSelection"
  />
</template>
<script setup lang="ts">
type TProps = {
  info: {
    schema: any;
    data: any;
  };
};
const route = useRoute();
const props = defineProps<TProps>();
const router = useRouter();
const schema = ref<any>(props.info.schema);
const data = ref<any>(props.info.data);
const error = ref<{
  [key: string]: string;
}>({});
const deleteConfirmModal = ref(false);
const showModal = ref(true);
const { toastData } = useGetState();
const refData = ref<{
  ref: string;
  type: "text" | "number" | "array";
  defaultValue: string | number | string[] | number[];
  key: string;
}>();
const { $typeCheck } = useNuxtApp();

if (Object.keys(data.value).length === 0) {
  for (const key in schema.value) {
    if (schema.value[key].default !== undefined) {
      data.value[key] = schema.value[key].default;
    } else if (key !== "_id") data.value[key] = "";
  }
}

const isValid = computed(() => {
  for (const [key, value] of Object.entries(schema.value)) {
    if (key === "password") continue;
    if ((value as any).required) {
      if (!data.value[key]) {
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
      if (key === "password") continue;
      if (!data.value[key]) {
        error.value[key] = "Không được để trống!";
      } else error.value[key] = "";
    }
  }
}

async function handleConfirm() {
  errorCheck();
  if (!isValid.value) return;
  const result = await useApi(
    `/${route.params.pre}/${route.params.post}${
      data.value._id ? "/" + data.value._id : ""
    }`,
    {
      method: data.value._id ? "PATCH" : "POST",
      body: data.value,
    }
  );
  if (result) {
    toastData.value.push({
      message: "Thành công",
      type: "success",
    });
    router.back();
  }
}

async function handleDelete() {
  if (!data.value) return;
  const result = await useApi(
    `/${route.params.pre}/${route.params.post}/${data.value._id}`,
    {
      method: "DELETE",
    }
  );

  if (result) {
    toastData.value.push({
      message: "Thành công",
      type: "success",
    });
    router.back();
  }
}

function handleRef(object: {
  ref: string;
  type: "text" | "number" | "array";
  defaultValue: string | number | string[] | number[];
  key: string;
}) {
  let { ref, type, defaultValue, key } = object;
  ref = ref.toLowerCase();
  refData.value = {
    ref,
    type,
    defaultValue,
    key,
  };
}

function handleSelection({
  selected,
  key,
}: {
  selected: { _id: string | number } | { _id: string | number }[];
  key: string;
}) {
  if (Array.isArray(selected)) {
    data.value[key] = selected.map((x) => x._id);
  } else data.value[key] = selected._id || null;
}
</script>

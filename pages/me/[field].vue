<template>
  <Teleport to="body">
    <Modal v-model="fieldModal" @update:model-value="handleClose">
      <div class="flex-col space-y-4 xl:w-[30%] lg:w-[40%] md:w-[60%] w-[90%]">
        <div
          class="max-h-[85%] overflow-y-scroll hidden-scrollbar space-y-[1px] !mt-[1px] rounded-b-[10px] rounded-t-[10px] relative"
        >
          <div
            class="py-2 px-4 bg-indigo-600 text-gray-100 flex items-center space-x-2 w-max min-w-full sticky top-0 justify-between"
          >
            <i
              class="fa-solid fa-arrow-left-long cursor-pointer bg-white p-2 text-[20px] rounded-full text-indigo-600 lg:hover:bg-indigo-900 lg:hover:text-white duration-200 h-[36px] aspect-1 flex justify-center items-center"
              @click="handleClose"
            ></i>
            <i
              class="fa-solid fa-check cursor-pointer text-[20px] bg-white p-2 rounded-full text-teal-600 lg:hover:bg-teal-900 duration-200 h-[36px] aspect-1 flex justify-center items-center lg:hover:text-white"
              @click="handleConfirm"
              v-if="!schema[route.params.field as string].disabled"
            ></i>
          </div>
          <div
            class="bg-gray-100 p-4 rounded-b-[10px]"
            :class="{
              'flex items-center space-x-4':
                $typeCheck(fieldData) === 'boolean',
              'space-y-2': $typeCheck(fieldData) !== 'boolean',
            }"
          >
            <div>{{ route.params.field }}:</div>
            <div
              :class="{
                'w-full': $typeCheck(fieldData) !== 'boolean',
              }"
            >
              <div v-if="$typeCheck(fieldData) === 'boolean'">
                <Toggle
                  v-model="fieldData"
                  :disabled="schema[route.params.field as string].disabled"
                />
              </div>
              <div
                v-else-if="route.params.field === 'password'"
                class="space-y-2"
              >
                <div class="space-y-1">
                  <input
                    class="input w-full"
                    type="password"
                    :class="{
                      'input-error': changePasswordError.password,
                    }"
                    v-model="changePasswordInfo.password"
                    placeholder="Nhập mật khẩu..."
                  />
                  <div
                    class="text-[12px] ml-1 text-red-600"
                    v-if="changePasswordError.password"
                  >
                    {{ changePasswordError.password }}
                  </div>
                </div>
                <div class="space-y-1">
                  <input
                    class="input w-full"
                    type="password"
                    :class="{
                      'input-error': changePasswordError.passwordConfirm,
                    }"
                    v-model="changePasswordInfo.passwordConfirm"
                    placeholder="Nhập lại mật khẩu"
                  />
                  <div
                    class="text-[12px] ml-1 text-red-600"
                    v-if="changePasswordError.passwordConfirm"
                  >
                    {{ changePasswordError.passwordConfirm }}
                  </div>
                </div>
              </div>
              <div v-else>
                <input
                  class="input input-blue w-full"
                  type="text"
                  v-model="fieldData"
                  :disabled="schema[route.params.field as string].disabled"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      ></Modal
    >
  </Teleport>
</template>
<script setup lang="ts">
import { useToast } from "vue-toastification";

const route = useRoute();
const router = useRouter();
const fieldModal = ref(true);
const { user } = useAuth();
const schemaApi = "/schema/user";
const schema = useState<any>(schemaApi, () => {});
const fieldData = ref<any>(user.value[route.params.field as keyof TUser]);
const { isFromInside } = useGetState();
const { loading } = useGetState();
const toast = useToast();
const { getUser } = useAuth();
const { $typeCheck } = useNuxtApp();
const changePasswordInfo = ref<{
  [key: string]: string;
}>({
  password: "",
  passwordConfirm: "",
});

const changePasswordError = ref<{
  [key: string]: string;
}>({
  password: "",
  passwordConfirm: "",
});

async function handleClose() {
  if (isFromInside.value) {
    router.back();
  } else {
    await navigateTo(
      {
        name: "me",
      },
      { replace: true }
    );
  }
}

const isChangePasswordValid = computed(() => {
  let result = true;
  for (const [key, value] of Object.entries(changePasswordInfo.value)) {
    if (!value) {
      result = false;
      changePasswordError.value[key] = "Không được để trống!";
    } else {
      result = true;
      changePasswordError.value[key] = "";
    }
  }

  if (
    changePasswordInfo.value.password !==
    changePasswordInfo.value.passwordConfirm
  ) {
    result = false;
    changePasswordError.value.passwordConfirm = "Password chưa khớp!";
  }

  for (const [key, value] of Object.entries(changePasswordError.value)) {
    if (value) {
      result = false;
    }
  }
  return result;
});

async function handleConfirm() {
  if (route.params.field === "password") {
    if (!isChangePasswordValid.value) return;
  }
  loading.value = true;
  await useApi("/me", {
    method: "PATCH",
    body: {
      [route.params.field as string]:
        route.params.field === "password"
          ? changePasswordInfo.value.password
          : fieldData.value,
    },
  });
  await getUser();
  await handleClose();
  toast.success("Thành công");
  loading.value = false;
}

watch(
  () => [
    changePasswordInfo.value.password,
    changePasswordInfo.value.passwordConfirm,
  ],
  ([newPassword, newPasswordConfirm], [oldPassword, oldPasswordConfirm]) => {
    if (newPassword !== oldPassword) {
      if (newPasswordConfirm) {
        if (newPasswordConfirm !== newPassword)
          changePasswordError.value.passwordConfirm = "Password không khớp!";
        else changePasswordError.value.passwordConfirm = "";
      } else changePasswordError.value.password = "";
      if (!newPassword)
        changePasswordError.value.password = "Không được để trống";
      else changePasswordError.value.password = "";
    } else if (newPasswordConfirm !== oldPasswordConfirm) {
      if (newPasswordConfirm !== newPassword && newPassword) {
        changePasswordError.value.passwordConfirm = "Password không khớp!";
      } else if (!newPasswordConfirm)
        changePasswordError.value.passwordConfirm = "Không được để trống!";
      else changePasswordError.value.passwordConfirm = "";
    } else
      changePasswordError.value = {
        password: "",
        passwordConfirm: "",
      };
  }
);

async function getSchema() {
  if (schema.value) return;
  const result: any = await useApi(schemaApi);
  schema.value = result.data;
}
await getSchema();

definePageMeta({
  middleware: [
    async (to, from) => {
      const { isFromInside } = useGetState();
      if (from.name) isFromInside.value = true;
      const schemaApi = "/schema/user";
      const schema = useState<any>(schemaApi, () => {});

      async function getSchema() {
        if (schema.value) return;
        const result: any = await useApi(schemaApi);
        schema.value = result.data;
      }
      await getSchema();
    },
  ],
});
</script>

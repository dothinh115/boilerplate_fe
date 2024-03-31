<template>
  <div class="space-y-8 lg:w-[50%] mx-auto">
    <div class="odd:bg-gray-50">Đổi thông tin cá nhân</div>
  </div>
</template>
<script setup lang="ts">
const { user } = useAuth();
const schema = ref<any>();
const { loading } = useGetState();
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
const changePasswordSuccess = ref(false);
const changePasswordLoading = ref(false);

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

  for (const [key, value] of Object.entries(changePasswordError.value)) {
    if (value) {
      result = false;
    }
  }
  return result;
});

async function handleChangePassword() {
  const isValid = isChangePasswordValid.value;
  if (!isValid) return;
  changePasswordLoading.value = true;
  try {
    await useApi("/me", {
      method: "PATCH",
      body: {
        password: changePasswordInfo.value.password,
      },
    });
    changePasswordSuccess.value = true;
  } catch (error) {
    console.log(error);
  }
  changePasswordLoading.value = false;
}

async function getSchema() {
  const result: any = await useApi("/schema/user");
  schema.value = result.data;
}
async function handleFetch() {
  loading.value = true;
  await getSchema();
  loading.value = false;
}

await handleFetch();
</script>

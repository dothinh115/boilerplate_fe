<template>
  <div class="space-y-8 lg:w-[50%] mx-auto">
    <div class="box">
      <div class="flex items-center space-x-2 title">
        <ion-icon name="person-outline"></ion-icon>
        <span> Thông tin cá nhân</span>
      </div>
      <div
        class="grid lg:grid-cols-2 grid-cols-1 p-4 gap-y-5 gap-x-6 bg-gray-100"
      >
        <template v-for="(item, index) in Object.keys(schema)" :key="index">
          <div v-if="item !== 'password'" class="space-y-1">
            <div class="text-gray-900">
              {{ item }}
            </div>
            <input
              :type="
                schema[item] === 'Number'
                  ? 'number'
                  : item === 'email'
                  ? 'email'
                  : 'text'
              "
              :disabled="
                item === '_id' ||
                item === 'rootUser' ||
                item === 'actived' ||
                item === 'email' ||
                item === 'role'
              "
              class="w-full input input-blue"
              :value="user[item]"
            />
          </div>
        </template>
      </div>
    </div>
    <form class="box" @submit.prevent="handleChangePassword">
      <div class="title flex items-center space-x-2">
        <ion-icon name="key-outline"></ion-icon>
        <span> Đổi mật khẩu</span>
      </div>
      <div class="space-y-4 mx-auto p-4 bg-gray-100">
        <div class="grid lg:grid-cols-2 grid-cols-1 gap-y-5 gap-x-6">
          <div class="space-y-1">
            <div class="text-gray-900">Password</div>
            <input
              type="password"
              class="w-full input"
              :class="changePasswordError.password ? 'input-red' : 'input-blue'"
              v-model.trim="changePasswordInfo.password"
            />
            <div
              class="text-red-500 text-[12px]"
              v-if="changePasswordError.password"
            >
              {{ changePasswordError.password }}
            </div>
          </div>
          <div class="space-y-1">
            <div class="text-gray-900">Nhập lại password</div>
            <input
              type="password"
              class="w-full input"
              v-model.trim="changePasswordInfo.passwordConfirm"
              :class="
                changePasswordError.passwordConfirm ? 'input-red' : 'input-blue'
              "
            />
            <div
              class="text-red-500 text-[12px]"
              v-if="changePasswordError.passwordConfirm"
            >
              {{ changePasswordError.passwordConfirm }}
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button class="btn btn-blue flex space-x-1 items-center">
            <span> Đổi mật khẩu</span>
            <span class="gg-spinner" v-if="changePasswordLoading"></span>
          </button>
          <span
            class="text-green-900 flex items-center space-x-1"
            v-if="changePasswordSuccess"
          >
            <ion-icon name="checkmark-outline"></ion-icon>
            <span>Thành công</span>
          </span>
        </div>
      </div>
    </form>
  </div>
</template>
<script setup lang="ts">
const { user } = useAuth();
const schema = ref<any>();
const loading = useState("loading");
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
  const promises = [getSchema()];
  loading.value = true;
  await Promise.all(promises);
  loading.value = false;
}

await handleFetch();
</script>

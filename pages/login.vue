<template>
  <form
    class="w-[320px] h-fit space-y-6 text-gray-100 relative"
    @submit.prevent="handleLoginSubmit"
  >
    <div class="flex justify-center">
      <IconLoginAdmin class="text-gray-200 w-[100px]" />
    </div>
    <div class="space-y-4">
      <div>
        <div
          class="border-2 border-white rounded-4 p-3 flex space-x-2 rounded-[4px] items-center duration-200"
          :class="{
            '!border-red-500': loginError.email || failed,
          }"
        >
          <IconUser />
          <input
            type="email"
            class="outline-none bg-transparent w-full text-[16px] placeholder:uppercase text-gray-100"
            placeholder="Email"
            v-model.trim="loginInfo.email"
          />
        </div>
        <div
          class="w-full text-red-300 text-[12px] ml-4"
          v-if="loginError.email"
        >
          {{ loginError.email }}
        </div>
      </div>
      <div>
        <div
          class="border-2 border-white rounded-4 p-3 flex space-x-2 rounded-[4px] items-center duration-200"
          :class="{
            '!border-red-500': loginError.password || failed,
          }"
        >
          <IconPassword />
          <input
            type="password"
            class="outline-none bg-transparent w-full text-[16px] placeholder:uppercase text-gray-100"
            placeholder="Password"
            v-model.trim="loginInfo.password"
          />
        </div>
        <div
          class="w-full text-red-300 text-[12px] ml-4"
          v-if="loginError.password"
        >
          {{ loginError.password }}
        </div>
      </div>
    </div>
    <div class="w-full text-red-300 text-[12px] ml-4 !my-2" v-if="failed">
      Email hoặc mật khẩu không đúng!
    </div>
    <div
      class="mt-8 space-y-2"
      :class="{
        '!mt-2': failed,
      }"
    >
      <button
        class="btn btn-white w-full flex items-center justify-center space-x-2"
      >
        <span>LOGIN</span> <span class="gg-spinner" v-if="loading"></span>
      </button>
      <GoogleLogin />
    </div>
  </form>
</template>
<script setup lang="ts">
const { login } = useAuth();
const failed = ref(false);
const loginInfo = ref({
  email: "",
  password: "",
});

const loginError = ref<{ [key: string]: string }>({
  email: "",
  password: "",
});

const loading = ref(false);

watch(
  () => [loginInfo.value.email, loginInfo.value.password],
  ([email, password], [oldEmail, oldPassword]) => {
    if (!email && email !== oldEmail) {
      loginError.value.email = "Email không được để trống!";
    } else if (email && email !== oldEmail && !emailPattern.test(email)) {
      loginError.value.email = "Email phải hợp lệ!";
    } else loginError.value.email = "";

    if (password !== oldPassword && !password) {
      loginError.value.password = "Password không được để trống!";
    } else loginError.value.password = "";
  }
);

const isValid = computed(() => {
  let result = true;
  Object.entries(loginInfo.value).map(([key, value]) => {
    if (!value) {
      result = false;
      loginError.value[key] = `${
        key.charAt(0).toUpperCase() + key.slice(1)
      } không được để trống!`;
    } else {
      result = true;
      loginError.value[key] = "";
    }
  });
  Object.entries(loginError.value).map(([key, value]) => {
    if (value) result = false;
  });
  return result;
});

const handleLoginSubmit = async () => {
  if (!isValid.value) return;
  loading.value = true;
  const user = await login(loginInfo.value);
  if (!user) failed.value = true;
  console.log(user);
  loading.value = false;
};

definePageMeta({
  layout: "login",
});
</script>

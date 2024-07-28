<template>
  <form
    class="w-[320px] h-fit space-y-2 relative"
    @submit.prevent="handleLoginSubmit"
  >
    <div class="flex justify-center">
      <IconLoginAdmin class="text-gray-200 w-[100px]" />
    </div>
    <div class="space-y-2 bg-gray-50 p-3 rounded-[15px] text-gray-900">
      <div class="space-y-1">
        <div
          class="space-y-2"
          :class="{
            '!border-red-500': loginError.email || failed,
          }"
        >
          <div class="flex space-x-2">
            <IconUser class="text-gray-900" />
            <span>Email address</span>
          </div>
          <input
            type="email"
            class="input"
            placeholder="Email"
            v-model.trim="loginInfo.email"
            :class="{
              'input-error': loginError.email || failed,
            }"
          />
        </div>
        <div
          class="w-full text-red-500 text-[12px] ml-2"
          v-if="loginError.email"
        >
          {{ loginError.email }}
        </div>
      </div>
      <div>
        <div
          class="space-y-2"
          :class="{
            '!border-red-500': loginError.email || failed,
          }"
        >
          <div class="flex space-x-2">
            <IconPassword class="text-gray-900" />
            <span>Password</span>
          </div>
          <input
            type="password"
            class="input"
            placeholder="Password"
            v-model.trim="loginInfo.password"
            :class="{
              'input-error': loginError.password || failed,
            }"
          />
        </div>
        <div
          class="w-full text-red-500 text-[12px] ml-4"
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
        class="btn btn-green w-full flex items-center justify-center space-x-2"
      >
        <span>Đăng nhập</span> <span class="gg-spinner" v-if="loading"></span>
      </button>
      <div
        class="relative flex items-center justify-center text-gray-200 before:absolute before:contents-[''] before:block before:h-[1px] before:w-full before:bg-gray-100 before:z-[1]"
      >
        <div class="relative z-[2] bg-[#2148c0] px-2">Hoặc</div>
      </div>
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
  middleware: [
    async (to) => {
      const { loading } = useGetState();
      const refreshTokenCookie = useCookie(REFRESH_TOKEN);
      const accessToken = to.query.accessToken;
      const refreshToken = to.query.refreshToken;
      if (accessToken && refreshToken) {
        loading.value = true;
        sessionStorage.setItem(ACCESS_TOKEN, accessToken as string);
        refreshTokenCookie.value = refreshToken as string;
        window.location.href = "/";
      } else {
        const newPath = to.fullPath.split("?")[0];
        if (window.location.pathname !== to.fullPath) {
          window.location.href = newPath;
        }
      }
    },
  ],
});
</script>

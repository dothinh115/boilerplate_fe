<template>
  <form
    class="w-[320px] h-fit space-y-4 relative"
    @submit.prevent="handleLoginSubmit"
  >
    <div class="flex justify-center">
      <IconLoginAdmin class="text-gray-200 w-[100px]" />
    </div>
    <div class="space-y-4 bg-gray-50 p-4 rounded-xl text-gray-900 shadow-md">
      <div class="space-y-2">
        <div
          class="space-y-1"
          :class="{
            '!border-red-500': loginError.email,
          }"
        >
          <div class="flex items-center space-x-2">
            <IconUser class="text-gray-900" />
            <span>Email</span>
          </div>
          <input
            type="email"
            class="input"
            placeholder="Email"
            v-model.trim="loginInfo.email"
            :class="{
              'input-error': loginError.email,
            }"
          />
        </div>
        <div class="text-red-500 text-sm" v-if="loginError.email">
          {{ loginError.email }}
        </div>
      </div>
      <div>
        <div
          class="space-y-1"
          :class="{
            '!border-red-500': loginError.password,
          }"
        >
          <div class="flex items-center space-x-2">
            <IconPassword class="text-gray-900" />
            <span>Mật khẩu</span>
          </div>
          <input
            type="password"
            class="input"
            placeholder="Mật khẩu"
            v-model.trim="loginInfo.password"
            :class="{
              'input-error': loginError.password,
            }"
          />
        </div>
        <div class="text-red-500 text-sm" v-if="loginError.password">
          {{ loginError.password }}
        </div>
      </div>
      <div class="flex items-center space-x-2 text-gray-700">
        <InputCheckbox v-model="loginInfo.remember" id="remember-me" />
        <label class="text-sm cursor-pointer" for="remember-me">
          Ghi nhớ đăng nhập
        </label>
      </div>
    </div>
    <div class="mt-6 space-y-2">
      <button
        class="btn btn-green w-full flex items-center justify-center space-x-2"
      >
        <span>Đăng nhập</span>
        <span class="gg-spinner" v-if="loading"></span>
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
import { useToast } from "vue-toastification";

const { login } = useAuth();
const loginInfo = ref({
  email: "",
  password: "",
  remember: false,
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
    if (key === "remember") return;
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
  await login(loginInfo.value);
  loading.value = false;
};

definePageMeta({
  layout: "login",
  middleware: [
    async (to) => {
      const tokenId = to.query.tokenId as string;
      const error = to.query.error as string;
      const { startLoading, finishLoading } = useLoading();
      const toast = useToast();
      if (tokenId) {
        startLoading();
        const params = {
          tokenId,
        };
        await useApi("auth/token", {
          params,
        });
        window.location.href = to.path;
      } else if (error) {
        finishLoading();
        toast.error("Đã có lỗi xảy ra!");
      }
    },
  ],
});
</script>

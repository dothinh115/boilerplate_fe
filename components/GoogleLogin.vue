<template>
  <button
    type="button"
    class="w-full duration-200 justify-center text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 space-x-1"
    @click="handleLoginWithGoogle"
  >
    <i class="fa-brands fa-google"></i>
    <span>Đăng nhập với Google</span>
  </button>
</template>

<script lang="ts" setup>
async function handleLoginWithGoogle() {
  const baseUrl = `${window.location.protocol}//${window.location.host}`;

  const authUrl = await useApi("/auth/google/url", {
    method: "POST",
    body: {
      redirectTo: `${baseUrl}/login`,
    },
  });
  window.location.href = authUrl;
}
</script>

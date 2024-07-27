<template>
  <button
    class="btn w-full bg-[#EA4335]"
    type="button"
    @click="handleLoginWithGoogle()"
  >
    <i class="fa-brands fa-google text-[18px]"></i>
    <span> Đăng nhập với Google </span>
  </button>
</template>
<script lang="ts" setup>
const { public: runTimeConfigPublic } = useRuntimeConfig();
const environment = runTimeConfigPublic.environment;
async function handleLoginWithGoogle() {
  const clientId = await useFingerSprint();
  const authUrl = await useApi("/auth/google/url", {
    method: "POST",
    body: {
      clientId,
      redirectTo:
        environment === "development"
          ? "http://localhost:3000/login"
          : "https://cp.truyenhot.info/login",
    },
  });
  window.location.href = authUrl;
}
</script>

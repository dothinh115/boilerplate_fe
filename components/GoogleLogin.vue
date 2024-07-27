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
const refreshTokenCookie = useCookie(REFRESH_TOKEN);
const { loading } = useGetState();
async function handleLoginWithGoogle() {
  loading.value = true;
  const width = 500;
  const height = 600;
  const left = screen.width / 2 - width / 2;
  const top = screen.height / 2 - height / 2;
  const clientId = await useFingerSprint();
  const authUrl = await useApi("/auth/google/url", {
    method: "POST",
    body: {
      clientId,
    },
  });
  window.open(
    authUrl,
    "google_login",
    `width=${width},height=${height},top=${top},left=${left}`
  );
}

onMounted(() => {
  window.addEventListener("message", handleMessage);
});

onUnmounted(() => {
  window.removeEventListener("message", handleMessage);
});

async function handleMessage(event: MessageEvent) {
  if (event.origin !== "https://api.truyenhot.info") return;
  const { accessToken, refreshToken } = event.data;
  sessionStorage.setItem(ACCESS_TOKEN, accessToken);
  refreshTokenCookie.value = refreshToken;
  loading.value = false;
  window.location.reload();
}
</script>

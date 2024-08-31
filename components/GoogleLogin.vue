<template>
  <div>
    <button
      type="button"
      class="bg-gray-500 max-lg:bg-orange-600 max-lg:text-white rounded-full w-8 h-8 max-lg:w-12 max-lg:h-12 max-lg:text-[1.125rem] flex items-center justify-center text-gray-200 mx-auto lg:hover:bg-orange-600 lg:hover:text-white duration-200"
      @click="handleLoginWithGoogle"
    >
      <i class="fa-brands fa-google"></i>
    </button>
  </div>
</template>

<script lang="ts" setup>
const { $apiFetch } = useNuxtApp();
const route = useRoute();
async function handleLoginWithGoogle() {
  const url = `${window.location.protocol}//${window.location.host}${
    route.query.next ? route.query.next : ""
  }`;
  const authUrl = await $apiFetch("/auth/google/url", {
    method: "POST",
    body: {
      redirectTo: url,
    },
  });
  window.location.href = authUrl;
}
</script>

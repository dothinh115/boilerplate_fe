<template>
  <div>
    <button
      type="button"
      class="bg-gray-500 max-lg:bg-orange-600 max-lg:text-white rounded-full w-8 h-8 max-lg:w-12 max-lg:h-12 max-lg:text-[1.125rem] flex items-center justify-center text-gray-200 mx-auto lg:hover:bg-orange-600 lg:hover:text-white duration-200"
      @click="handleLoginWithGoogle"
    >
      <span class="gg-spinner" v-if="loading"></span>
      <i class="fa-brands fa-google" v-else></i>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useToast } from "vue-toastification";

const { $apiFetch } = useNuxtApp();
const route = useRoute();
const toast = useToast();
const loading = ref(false);
const clientId = await useFingerSprint();
async function handleLoginWithGoogle() {
  loading.value = true;
  try {
    let nextUrl: string | null = null;
    try {
      const url = new URL(route.query.next as string);
      nextUrl = url.href;
    } catch (error) {
      console.log(`${route.query.next} không phải là url hợp lệ`);
    }
    let url = `${window.location.protocol}//${window.location.host}${
      route.query.next ? route.query.next : ""
    }`;
    if (nextUrl) {
      url = `${window.location.protocol}//${window.location.host}?next=${nextUrl}`;
    }
    const authUrl = await $apiFetch("/auth/google/url", {
      method: "POST",
      body: {
        redirectTo: url,
        clientId,
      },
    });
    window.location.href = authUrl;
  } catch (error) {
    toast.error("Có lỗi xảy ra");
  } finally {
    await new Promise((resolve) => setTimeout(() => resolve, 500));
    loading.value = false;
  }
}
</script>

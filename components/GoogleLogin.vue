<template>
  <div>
    <a
      type="button"
      class="bg-gray-500 max-lg:bg-orange-600 max-lg:text-white rounded-full w-8 h-8 max-lg:w-12 max-lg:h-12 max-lg:text-[1.125rem] flex items-center justify-center text-gray-200 mx-auto lg:hover:bg-orange-600 lg:hover:text-white duration-200"
      :href
    >
      <span class="gg-spinner" v-if="loading"></span>
      <i class="fa-brands fa-google" v-else></i>
    </a>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();

const loading = ref(false);
const google_client_id = useRuntimeConfig().public.google_client_id;
const href = computed(() => {
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
  const state = JSON.stringify({
    redirectTo: url,
  });
  const scope = "email profile";
  const callBackUri = `${window.location.protocol}//${window.location.host}/api/auth/google/callback`;
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${google_client_id}&redirect_uri=${callBackUri}&response_type=code&scope=${scope}&state=${state}`;
});

onMounted(() => {
  loading.value = false;
});
</script>

<template>
  <div
    class="bg-indigo-900 w-[40px] flex flex-col justify-between text-[16px] flex-shrink-0 relative"
  >
    <div>
      <div
        class="bg-indigo-950 flex justify-center items-center lg:hover:bg-gray-50 duration-200"
      >
        <button
          class="h-full text-gray-50 w-full aspect-1 lg:hover:text-indigo-950"
          @click="handleHideSidebar"
        >
          <i
            class="fa-solid fa-chevron-left"
            :class="{
              'rotate-180': hideSidebar,
            }"
          ></i>
        </button>
      </div>
      <div
        class="bg-slate-300 flex justify-center items-center lg:hover:bg-gray-50 duration-200"
      >
        <NuxtLink
          :to="'/'"
          class="h-full text-indigo-800 w-full aspect-1 lg:hover:text-indigo-950 flex items-center justify-center"
        >
          <i class="fa-solid fa-house"></i>
        </NuxtLink>
      </div>
    </div>
    <div class="flex justify-center">
      <button
        class="text-gray-50 w-full aspect-1 bg-gray-500"
        @click="logoutConfirmModal = true"
      >
        <i class="fa-solid fa-right-from-bracket fa-lg rotate-180"></i>
      </button>
    </div>
  </div>
  <Confirm
    :message="`Bạn có chắc chắn muốn thoát ra không?`"
    :handle="logout"
    v-model="logoutConfirmModal"
  >
    <template #icon>
      <i
        class="fa-solid fa-right-from-bracket text-[48px] text-indigo-600 rotate-180"
      ></i>
    </template>
    <template #message>
      <div>
        {{ user.email }}
      </div>
    </template>
  </Confirm>
</template>
<script setup lang="ts">
const { hideSidebar } = useGetState();
const { logout, user } = useAuth();
const logoutConfirmModal = ref(false);
function handleHideSidebar() {
  hideSidebar.value = !hideSidebar.value;
}
</script>

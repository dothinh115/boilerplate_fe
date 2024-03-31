<template>
  <div
    class="bg-indigo-900 w-[40px] flex flex-col justify-between text-[16px] flex-shrink-0 relative"
  >
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
    <div class="flex justify-center">
      <button
        class="text-gray-50 w-full aspect-1 bg-gray-500"
        @click="logoutConfirmModel = true"
      >
        <i class="fa-solid fa-right-from-bracket fa-lg rotate-180"></i>
      </button>
    </div>
  </div>
  <Teleport to="body">
    <Modal v-model="logoutConfirmModel">
      <Confirm
        :message="'Bạn có chắc chắn muốn thoát ra không?'"
        :handle="logout"
        v-model="logoutConfirmModel"
      >
        <template #icon>
          <i
            class="fa-solid fa-right-from-bracket text-[48px] text-indigo-600 rotate-180"
          ></i>
        </template>
      </Confirm>
    </Modal>
  </Teleport>
</template>
<script setup lang="ts">
const { hideSidebar } = useGetState();
const { logout } = useAuth();
const logoutConfirmModel = ref(false);
function handleHideSidebar() {
  hideSidebar.value = !hideSidebar.value;
}
</script>

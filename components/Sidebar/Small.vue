<template>
  <div
    class="bg-indigo-900 w-[40px] flex flex-col justify-between text-[16px] flex-shrink-0 relative"
  >
    <div class="bg-indigo-950 flex justify-center items-center">
      <button
        class="h-full text-gray-50 w-full aspect-1"
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
        @click="logout()"
      >
        <i class="fa-solid fa-right-from-bracket fa-lg rotate-180"></i>
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
const hideSidebar = useState("hideSidebar");
const { logout } = useAuth();
function handleHideSidebar() {
  hideSidebar.value = !hideSidebar.value;
}
</script>

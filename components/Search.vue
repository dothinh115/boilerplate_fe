<template>
  <div
    class="space-y-8 mx-auto max-h-[90%] rounded-[10px] h-fit flex items-center"
    :class="{
      '2xl:w-[40%] xl:w-[50%] lg:w-[70%] w-[95%]': !small,
      '2xl:w-[30%] xl:w-[40%] lg:w-[50%] md:w-[70%] w-[95%]': small,
    }"
  >
    <div
      class="rounded-[10px] max-h-[95vh] overflow-y-scroll hidden-scrollbar relative w-full"
    >
      <div
        class="flex items-center justify-between space-x-2 title !py-2 sticky top-0 z-[1000]"
      >
        <i
          class="fa-solid fa-arrow-left-long cursor-pointer bg-white p-2 rounded-full text-indigo-600 lg:hover:bg-indigo-900 lg:hover:text-white duration-200"
          @click="handleClose"
        ></i>
        Tìm kiếm
        <div class="flex items-center space-x-2 h-full">
          <i
            class="fa-solid fa-check cursor-pointer bg-white p-2 rounded-full text-teal-600 lg:hover:bg-teal-900 duration-200 h-[36px] aspect-1 flex justify-center items-center lg:hover:text-white"
            @click="searchConfirm"
          ></i>
        </div>
      </div>
      <div class="p-4 space-y-2 bg-gray-100 max-h-full">
        <div>Tìm kiếm theo:</div>

        <div
          class="flex md:space-x-2 max-md:space-y-2 items-center max-md:flex-wrap"
        >
          <div class="md:max-w-[15%] max-md:w-full">
            <select v-model="field" class="input input-blue w-full">
              <option
                v-for="(item, index) in Object.keys(localSchema)"
                :key="index"
                :value="item"
              >
                {{ item }}
              </option>
            </select>
          </div>
          <div class="md:flex-1 max-md:w-full">
            <select v-model="searchKey" class="input input-blue w-full">
              <option
                v-for="([key, value], index) in Object.entries(compareKey)"
                :key="index"
                :value="value"
              >
                {{ key }}
              </option>
            </select>
          </div>
          <div class="md:flex-1 max-md:w-full">
            <input
              v-model="searchValue"
              type="text"
              class="input w-full"
              placeholder="Tìm kiếm..."
              @keyup.enter="searchConfirm"
              :class="{
                'input-red': invalid,
                'input-blue': !invalid,
              }"
              :disabled="!field || !searchKey"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
type TProps = {
  schema: object;
  small?: boolean;
  searching: {
    field: string;
    searchKey: string;
    searchValue: string;
  };
};
const compareKey = {
  "$eq (bằng)": "$eq",
  "$regex (xuất hiện trong chuỗi)": "$regex",
  "$in (xuất hiện 1 lần trong mảng)": "$in",
  "$all (xuất hiện tất cả trong mảng)": "$all",
  "$nin (không xuất hiện trong mảng)": "$nin",
};
const props = defineProps<TProps>();
const localSchema = ref(props.schema);
const route = useRoute();
const emits = defineEmits(["close", "searchConfirm"]);
const field = ref(props.searching.field ? props.searching.field : "id");
const searchKey = ref(
  props.searching.searchKey ? props.searching.searchKey : "_eq"
);
const searchValue = ref(
  props.searching.searchValue ? props.searching.searchValue : ""
);
const invalid = ref(false);
function handleClose() {
  emits("close");
}

watch(
  () => searchValue.value,
  (newVal) => {
    if (invalid.value) invalid.value = false;
  }
);

async function searchConfirm() {
  if (!searchValue.value) {
    invalid.value = true;
    return;
  }
  emits("searchConfirm", {
    field: field.value,
    searchKey: searchKey.value,
    searchValue: searchValue.value,
  });
}
</script>

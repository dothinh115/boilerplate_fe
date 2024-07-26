export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("click-outside", {
    mounted(el, binding) {
      el.clickOutSideEvent = (event: MouseEvent) => {
        if (el !== event.target && !el.contains(event.target)) {
          binding.value(event);
        }
      };
      document.body.addEventListener("mousedown", (e) =>
        el.clickOutSideEvent(e)
      );
    },
    unmounted(el) {
      document.body.addEventListener("mousedown", (e) =>
        el.clickOutSideEvent(e)
      );
    },
  });
});

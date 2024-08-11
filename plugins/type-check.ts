export default defineNuxtPlugin(() => {
  return {
    provide: {
      typeCheck: (value: any) => {
        if (value === null || value === undefined) return null;
        if (Array.isArray(value)) return "array";
        return typeof value;
      },
    },
  };
});

export default defineNuxtPlugin(() => {
  return {
    provide: {
      typeCheck: (value: any) => {
        if (value === null || value === undefined) return null;
        if (Array.isArray(value)) return "array";
        if (typeof value === "string") {
          if (value.length >= 50) return "longText";
          else return "string";
        }
        return typeof value;
      },
    },
  };
});

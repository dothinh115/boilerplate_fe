export default defineNuxtPlugin(() => {
  return {
    provide: {
      getMaxLength: (obj: { schema: object; data: any[] }) => {
        const { $typeCheck } = useNuxtApp();
        const { schema, data } = obj;
        const fieldObj: any = {};
        for (const field in schema) {
          fieldObj[field] = field.length;
          for (const item of data) {
            let currentLength = 0;
            switch ($typeCheck(item[field])) {
              case "array":
                currentLength = item[field].join(",").length;
              case "string":
              case "longText":
                currentLength = item[field].length;
              case null:
                currentLength = 4;
              default: {
                currentLength = String(item[field]).length;
              }
            }
            if (!currentLength) currentLength = 0;
            if (currentLength > fieldObj[field])
              fieldObj[field] = currentLength;
          }
        }

        return fieldObj;
      },
    },
  };
});

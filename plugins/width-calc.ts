export default defineNuxtPlugin(() => {
  return {
    provide: {
      widthCalc: (widthObj: { [key: string]: number }) => {
        let result: any = {};
        watchEffect(() => {
          const perChar = 12;
          for (const [key, value] of Object.entries(widthObj)) {
            let w = value * perChar;
            if (w < 80) w = 80;
            else if (w > 200) {
              if (key === "id") w = 120;
              else w = 200;
            }

            result[key] = w;
          }
        });
        return result;
      },
    },
  };
});

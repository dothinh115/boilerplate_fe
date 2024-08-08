export default defineNuxtPlugin(() => {
  return {
    provide: {
      widthCalc: (widthObj: { [key: string]: number }) => {
        let result: any = {};
        watchEffect(() => {
          const perChar = 12;
          for (const [key, value] of Object.entries(widthObj)) {
            let w = value * perChar;
            if (w < 50) w = 50;
            else if (w > 300) w = 300;
            if (key === "id") w = 100;
            result[key] = w;
          }
        });
        return result;
      },
    },
  };
});

export default defineNuxtPlugin(() => {
  return {
    provide: {
      widthCalc: (widthObj: { [key: string]: number }) => {
        let result: any = {};
        const { screenWidth } = useGetState();
        watchEffect(() => {
          const perChar = 11.5;
          for (const [key, value] of Object.entries(widthObj)) {
            let w = value * perChar;
            if (w < 80) w = 80;
            else if (w > 300) {
              if (key === "id") w = 120;
              else if (screenWidth.value <= 375) {
                w = 200;
              } else if (screenWidth.value > 375 && screenWidth.value <= 430) {
                w = 230;
              } else w = 300;
            }

            result[key] = w;
          }
        });
        return result;
      },
    },
  };
});

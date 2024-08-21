export default defineNuxtPlugin(() => {
  return {
    provide: {
      widthCalc: (widthObj: { [key: string]: number }) => {
        let result: any = {};
        const { screenWidth } = useGetState();
        const perChar = 10;
        for (const [key, value] of Object.entries(widthObj)) {
          let w = value * perChar;
          if (w < 80) w = 80;
          else if (w > 300) {
            if (key === "id") w = 120;
            else if (screenWidth.value <= 375) {
              w = 200;
            } else if (screenWidth.value > 375 && screenWidth.value <= 390) {
              w = 210;
            } else if (screenWidth.value > 390 && screenWidth.value <= 430) {
              w = 220;
            } else if (screenWidth.value > 430 && screenWidth.value <= 500) {
              w = 250;
            } else w = 300;
          }

          result[key] = w;
        }
        return result;
      },
    },
  };
});

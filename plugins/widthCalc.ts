export default defineNuxtPlugin(() => {
  return {
    provide: {
      widthCalc: (widthObj: { [key: string]: number }) => {
        const perChar = 8;
        let result: any = {};
        for (const [key, value] of Object.entries(widthObj)) {
          let w = value * perChar;
          if (w < 50) w = 50;
          else if (w > 300) w = 300;
          result[key] = w;
        }
        return result;
      },
    },
  };
});

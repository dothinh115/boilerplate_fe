import * as htmlparser2 from "htmlparser2";
export default defineNuxtPlugin(() => {
  return {
    provide: {
      typeCheck: (value: any) => {
        if (value === null || value === undefined) return null;
        if (Array.isArray(value)) return "array";
        if (typeof value === "string") {
          if (value.length >= 50) {
            let isOpentag = false;
            const parser = new htmlparser2.Parser({
              onopentag() {
                isOpentag = true;
              },
              onclosetag() {
                if (isOpentag) parser.end();
              },
            });
            parser.write("<bar>");
            if (isOpentag) return "richText";
            else return "string";
          } else return "string";
        }
        return typeof value;
      },
    },
  };
});

export default defineNuxtPlugin(() => {
  return {
    provide: {
      iconClass: (mimeType: string) => {
        switch (mimeType) {
          case "image/jpg":
          case "image/png":
          case "image/webp":
          case "image/jpeg":
            return "fa-image text-red-500";
          case "application/pdf":
            return "fa-file-pdf text-red-400";
          case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
            return "fa-file-excel text-emerald-600";
          case "application/zip":
            return "fa-file-zipper text-yellow-500";
          default:
            return "fa-file text-gray-100";
        }
      },
    },
  };
});

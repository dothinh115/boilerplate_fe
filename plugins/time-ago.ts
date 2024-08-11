export default defineNuxtPlugin(() => {
  return {
    provide: {
      timeAgo: (date: string) => {
        const curDate = new Date(date);
        const now = new Date();
        const secondsPast = Math.floor(
          (now.getTime() - curDate.getTime()) / 1000
        );

        if (secondsPast < 60) {
          return `${secondsPast} giây trước`;
        }
        if (secondsPast < 3600) {
          const minutesPast = Math.floor(secondsPast / 60);
          return `${minutesPast} phút trước`;
        }
        if (secondsPast < 86400) {
          const hoursPast = Math.floor(secondsPast / 3600);
          return `${hoursPast} giờ trước`;
        }
        if (secondsPast < 2592000) {
          const daysPast = Math.floor(secondsPast / 86400);
          return `${daysPast} ngày trước`;
        }
        if (secondsPast < 31536000) {
          const monthsPast = Math.floor(secondsPast / 2592000);
          return `${monthsPast} tháng trước`;
        }

        const yearsPast = Math.floor(secondsPast / 31536000);
        return `${yearsPast} năm trước`;
      },
    },
  };
});

const paginate = (
  totalPages: number,
  currentPage: number,
  range: number
): (number | string)[] => {
  let pages: (number | string)[] = [];

  if (currentPage !== 1) pages.push(1);

  if (currentPage - range > 2) {
    pages.push("...");
  }

  const startRange = Math.max(2, currentPage - range);

  const endRange = Math.min(currentPage + range + 1, totalPages);
  for (let i = startRange; i < currentPage; i++) {
    pages.push(i);
  }

  pages.push(currentPage);

  for (let i = currentPage + 1; i < endRange; i++) {
    pages.push(i);
  }

  if (currentPage + range < totalPages) {
    pages.push("...");
  }

  if (totalPages !== 1 && totalPages !== currentPage) {
    pages.push(totalPages);
  }

  return pages;
};

export default function usePagnate(
  obj: {
    totalPages: number;
    currentPage: number;
    range: number;
  },
  callback: Function
) {
  const pages = paginate(obj.totalPages, obj.currentPage, obj.range);
  callback(pages);
}

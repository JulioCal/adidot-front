import { useMemo } from "react";

export const usePagination = ({
  currentPage,
  totalCount,
  siblingCount,
  pageSize,
}) => {
  const DOTS = "...";
  const range = (start, end) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };
  const paginationRange = useMemo(() => {
    let currPage = currentPage;
    let lastPage = Math.ceil(totalCount / pageSize);
    let firstPageIndex = 1;
    const totalPageNumbers = siblingCount + 5;
    if (totalPageNumbers >= lastPage) {
      return range(1, lastPage);
    }
    const leftSiblingIndex = Math.max(currPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currPage + siblingCount, lastPage);
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < lastPage - 2;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);
      return [...leftRange, DOTS, lastPage];
    }
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(lastPage - rightItemCount + 1, lastPage);
      return [firstPageIndex, DOTS, ...rightRange];
    }
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPage];
    }
  }, [currentPage, siblingCount, totalCount, pageSize]);

  return paginationRange;
};

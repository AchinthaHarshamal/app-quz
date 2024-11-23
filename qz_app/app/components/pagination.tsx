import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MyPaginationProps {
  totalCount: number;
  pageSize: number;
  setPageNumber: (page: number) => void;
}

export function MyPagination({ totalCount, pageSize, setPageNumber }: MyPaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPageCount = Math.ceil(totalCount / pageSize);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      setPageNumber(page);
    },
    [setPageNumber]
  );

  const renderPageNumbers = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPageCount <= maxVisiblePages) {
      for (let i = 1; i <= totalPageCount; i++) {
        items.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-4 py-2 mx-1 rounded ${currentPage === i ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            {i}
          </button>
        );
      }
    } else {
      items.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`px-4 py-2 mx-1 rounded ${currentPage === 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          1
        </button>
      );

      if (currentPage > 3) {
        items.push(<span key="ellipsis-start" className="px-2">...</span>);
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPageCount - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-4 py-2 mx-1 rounded ${currentPage === i ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            {i}
          </button>
        );
      }

      if (currentPage < totalPageCount - 2) {
        items.push(<span key="ellipsis-end" className="px-2">...</span>);
      }

      items.push(
        <button
          key={totalPageCount}
          onClick={() => handlePageChange(totalPageCount)}
          className={`px-4 py-2 mx-1 rounded ${currentPage === totalPageCount ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          {totalPageCount}
        </button>
      );
    }

    return items;
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 mx-1 rounded bg-gray-200 disabled:opacity-50"
      >
        <ChevronLeft />
      </button>
      <div className="hidden sm:flex">
        {renderPageNumbers()}
      </div>
      <button
        onClick={() => handlePageChange(Math.min(currentPage + 1, totalPageCount))}
        disabled={currentPage === totalPageCount}
        className="px-4 py-2 mx-1 rounded bg-gray-200 disabled:opacity-50"
      >
        <ChevronRight />
      </button>
    </div>
  );
}

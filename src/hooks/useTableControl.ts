import { useState } from "react";

export default function useTableControl() {
  const [page, setPage] = useState<number>(1);
  const [pageLimit, setPageLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [selectedRow, setSelectedRow] = useState<string>(""); // use for highlight the row of the table

  const onChangePage = (pageNumber: any) => {
    setPage(Number(pageNumber));
  };

  const onChangeLimit = (limitNumber: any) => {
    setPageLimit(Number(limitNumber));
    // refetch();
  };

  return {
    page,
    pageLimit,
    search,
    setSearch,
    selectedRow,
    onChangePage,
    onChangeLimit,
    setSelectedRow,
  };
}

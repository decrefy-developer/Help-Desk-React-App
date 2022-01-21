export interface ListResponse<T> {
  docs: T[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: number;
  page: number;
  pagingCounter: number;
  prevPage: number;
  totalDocs: number;
  totalPages: number;
}

export interface PageArgs {
  page: number;
  limit: number;
  search: string;
  status: boolean;
}

export interface ITeamChannel {
  _id: string;
  team: string;
  channels: [
    {
      _id: string;
      name: string;
    }
  ];
}

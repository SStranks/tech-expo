export type PaginationInput = {
  limit: number;
  offset: number;
};

export type PaginationResult<T> = {
  items: T[];
  totalCount: number;
};

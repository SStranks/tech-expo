export type Paginated<T> = {
  items: T[];
  totalCount: number;
  limit: number;
  offset: number;
  hasNextPage: boolean;
};

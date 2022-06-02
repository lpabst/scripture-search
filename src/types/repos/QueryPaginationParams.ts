import { OrderDir } from "../enums/OrderDir";

export interface QueryPaginationParams {
  limit: number;
  offset: number;
  orderBy: string;
  orderDir: OrderDir;
}

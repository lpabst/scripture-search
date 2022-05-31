export async function promiseTimeout(msDelay: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), msDelay);
  });
}

export function getPaginationParamsFromReqQuery(reqQuery: any) {
  const orderBy = reqQuery.orderBy;
  const orderDir = reqQuery.orderDir;
  const offset = reqQuery.offset || 0;
  let limit = reqQuery.limit || 25;
  if (limit > 100) {
    limit = 100;
  }

  return {
    limit,
    offset,
    orderBy,
    orderDir,
  };
}

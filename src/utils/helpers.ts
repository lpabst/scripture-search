export async function promiseTimeout(msDelay: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), msDelay);
  });
}

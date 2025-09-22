export async function parallel<T>(
  iterable: Iterable<T> | AsyncIterable<T>,
  concurrency: number,
  fn: (item: T) => Promise<any>,
) {
  const errors: Error[] = [];
  const running: Promise<any>[] = [];

  for await (const item of iterable) {
    while (running.length >= concurrency) {
      await Promise.race(running);
    }

    const promise = fn(item)
      .catch((error) => {
        errors.push(error);
      })
      .finally(() => {
        running.splice(running.indexOf(promise), 1);
      });

    running.push(promise);
  }

  await Promise.allSettled(running);

  return errors;
}

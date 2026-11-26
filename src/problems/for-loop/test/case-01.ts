// 値の型ではなく値そのものを比べるため unknown として扱う
const actual: unknown = limit;
if (actual !== 10) {
  throw new Error(`limit は 10 を期待しましたが ${JSON.stringify(actual)} でした`);
}
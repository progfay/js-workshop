// 値の型ではなく値そのものを比べるため unknown として扱う
const actual: unknown = rounded;
if (actual !== 2) {
  throw new Error(`rounded は 2 を期待しましたが ${JSON.stringify(actual)} でした`);
}
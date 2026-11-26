// 値の型ではなく値そのものを比べるため unknown として扱う
const actual: unknown = number;
if (actual !== 128) {
  throw new Error(`number は 128 を期待しましたが ${JSON.stringify(actual)} でした`);
}
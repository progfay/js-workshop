// 値の型ではなく値そのものを比べるため unknown として扱う
const actual: unknown = length;
if (actual !== 14) {
  throw new Error(`length は 14 を期待しましたが ${JSON.stringify(actual)} でした`);
}
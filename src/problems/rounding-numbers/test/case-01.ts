// 値の型ではなく値そのものを比べるため unknown として扱う
const actual: unknown = roundUp;
if (actual !== 1.5) {
  throw new Error(`roundUp は 1.5 を期待しましたが ${JSON.stringify(actual)} でした`);
}
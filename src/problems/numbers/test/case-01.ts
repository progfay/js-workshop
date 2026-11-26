// 値の型ではなく値そのものを比べるため unknown として扱う
const actual: unknown = example;
if (actual !== 123456789) {
  throw new Error(`example は 123456789 を期待しましたが ${JSON.stringify(actual)} でした`);
}
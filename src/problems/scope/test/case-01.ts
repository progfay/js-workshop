// 値の型ではなく値そのものを比べるため unknown として扱う
const actual: unknown = result;
if (actual !== "a: 1, b: 8, c: 6") {
  throw new Error(`result は "a: 1, b: 8, c: 6" を期待しましたが ${JSON.stringify(actual)} でした`);
}
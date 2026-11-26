// 値の型ではなく値そのものを比べるため unknown として扱う
const actual: unknown = example;
if (actual !== "example string") {
  throw new Error(`example は "example string" を期待しましたが ${JSON.stringify(actual)} でした`);
}
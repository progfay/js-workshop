// 値の型ではなく値そのものを比べるため unknown として扱う
const actual: unknown = replaced;
if (actual !== "pizza is wonderful") {
  throw new Error(`replaced は "pizza is wonderful" を期待しましたが ${JSON.stringify(actual)} でした`);
}
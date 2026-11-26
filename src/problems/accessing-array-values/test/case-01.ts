// 値の型ではなく値そのものを比べるため unknown として扱う
const actual: unknown = second;
if (actual !== "pizza") {
  throw new Error(`second は "pizza" を期待しましたが ${JSON.stringify(actual)} でした`);
}
// 値の型ではなく値そのものを比べるため unknown として扱う
const actual: unknown = types;
if (actual !== "only pizza") {
  throw new Error(`types は "only pizza" を期待しましたが ${JSON.stringify(actual)} でした`);
}
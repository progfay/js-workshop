// 値の型ではなく値そのものを比べるため unknown として扱う
const actual: unknown = pizza;
if (actual !== "pizza is alright") {
  throw new Error(`pizza は "pizza is alright" を期待しましたが ${JSON.stringify(actual)} でした`);
}
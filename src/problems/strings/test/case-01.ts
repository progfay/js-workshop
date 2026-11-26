// 値の型ではなく値そのものを比べるため unknown として扱う
const actual: unknown = someString;
if (actual !== "this is a string") {
  throw new Error(`someString は "this is a string" を期待しましたが ${JSON.stringify(actual)} でした`);
}
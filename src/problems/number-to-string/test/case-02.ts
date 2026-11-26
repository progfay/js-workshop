// 値の型ではなく値そのものを比べるため unknown として扱う
const actual: unknown = numString;
if (actual !== "128") {
  throw new Error(`numString は 文字列 "128" を期待しましたが ${JSON.stringify(actual)} でした`);
}
// message の値が "hello" か
// 値の型ではなく値そのものを比べるため unknown として扱う
const actual: unknown = message;
if (actual !== "hello") {
  throw new Error(`message は "hello" を期待しましたが ${JSON.stringify(actual)} でした`);
}
// 値の型ではなく値そのものを比べるため unknown として扱う
const actual: unknown = total;
if (actual !== 45) {
  throw new Error(`total は 45 (0 から 9 までの合計) を期待しましたが ${JSON.stringify(actual)} でした`);
}
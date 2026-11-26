// mood が "excited" に再代入されているか
// 値の型ではなく値そのものを比べるため unknown として扱う
const actual: unknown = mood;
if (actual !== "excited") {
  throw new Error(`mood は "excited" を期待しましたが ${JSON.stringify(actual)} でした`);
}

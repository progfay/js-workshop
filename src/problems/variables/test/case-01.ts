// language に "JavaScript" が代入されているか
// 値の型ではなく値そのものを比べるため unknown として扱う
const actual: unknown = language;
if (actual !== "JavaScript") {
  throw new Error(`language は "JavaScript" を期待しましたが ${JSON.stringify(actual)} でした`);
}

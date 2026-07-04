// language に "JavaScript" が代入されているか
if (language !== "JavaScript") {
  throw new Error(`language は "JavaScript" を期待しましたが ${JSON.stringify(language)} でした`);
}

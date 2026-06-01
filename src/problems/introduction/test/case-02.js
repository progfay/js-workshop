// message の値が "hello" か
if (message !== "hello") {
  throw new Error(`message は "hello" を期待しましたが ${JSON.stringify(message)} でした`);
}
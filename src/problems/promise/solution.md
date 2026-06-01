# 解説

```js
function getData(key) {
  return new Promise((resolve, reject) => {
    if (key !== "greeting") {
      reject(new Error(`unknown key: ${key}`));
      return;
    }
    setTimeout(() => resolve("Hello"), 1000);
  });
}
```

`reject` を呼んだら `return` で実行を止めるのを忘れないようにしましょう。
`reject` された Promise を `await` すると、その場で例外が throw されます。
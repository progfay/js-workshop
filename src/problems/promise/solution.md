# 解説

```js
function getData(key) {
  return new Promise((resolve, reject) => {
    if (key === "greeting") {
      resolve("Hello");
    } else {
      reject(new Error(`unknown key: ${key}`));
    }
  });
}
```

成功なら `resolve(値)`、失敗なら `reject(エラー)` を呼び分けます。
`reject` された Promise を `await` すると、その場で例外が throw されます。

実際の非同期処理では、`resolve` は後から呼ばれます
（例: `setTimeout(() => resolve("Hello"), 1000)`）。
すぐに `resolve` を呼んでも、後から呼んでも、
呼び出し側は同じように `await` で結果を受け取れます。

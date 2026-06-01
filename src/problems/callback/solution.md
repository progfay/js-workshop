# 解説

```js
function delay(callback) {
  setTimeout(callback, 1000);
}
```

`setTimeout` に `callback` を渡すと、現在の同期処理が終わった後にコールバックが呼ばれます。
そのため、`delay` を呼んだ直後の同期コードのほうが先に実行されます。
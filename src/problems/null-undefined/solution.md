# 解説

```js
function getOrDefault(value, fallback) {
  return value ?? fallback;
}
```

`??` を使うと「`null` / `undefined` のときだけ既定値」という意図を簡潔に書けます。
`||` を使うと `0` や `""`, `false` まで `fallback` に置き換わってしまうので、ここでは不適切です。
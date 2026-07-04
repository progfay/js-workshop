# 解説

```js
function getOrDefault(value, fallback) {
  return value ?? fallback;
}
```

`??` を使うと「`null` / `undefined` のときだけ既定値」という意図を簡潔に書けます。
`if` 文で書いた次のコードと同じ意味です。

```js
function getOrDefault(value, fallback) {
  if (value === null || value === undefined) {
    return fallback;
  }
  return value;
}
```

`||` を使うと `0` や `""`, `false` まで `fallback` に置き換わってしまいます。
試しに `return value || fallback;` に書き換えて実行すると、
`0` / `""` / `false` の3つのテストケースだけが失敗するのが確認できます。
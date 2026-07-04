# 解説

```js
function describe(fruit) {
  if (fruit.length > 5) {
    return "The fruit name has more than five characters.";
  } else {
    return "The fruit name has five characters or less.";
  }
}
```

`> 5` なので、ちょうど 5 文字の `"apple"` は「5 文字以下」側になります。境界に注意しましょう。
もし `>= 5` と書き間違えると、`describe("apple")` のテストケースだけが失敗します。

`return` した時点で関数は終わるので、`else` を省略して次のようにも書けます。

```js
function describe(fruit) {
  if (fruit.length > 5) {
    return "The fruit name has more than five characters.";
  }
  return "The fruit name has five characters or less.";
}
```
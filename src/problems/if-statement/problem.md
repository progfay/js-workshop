# if文

条件によって実行する処理を変えられます。

```js
if (n > 1) {
  // n が 1 より大きいとき
} else {
  // それ以外のとき
}
```

`else` は省略可能です。

## やってみよう

文字列 `fruit` を受け取り、次を返す関数 `describe` を実装してください。

- `fruit` の文字数が **5 より大きい** → `"The fruit name has more than five characters."`
- そうでなければ → `"The fruit name has five characters or less."`

```js
describe("orange"); // -> "The fruit name has more than five characters."  (6 文字)
describe("apple"); // -> "The fruit name has five characters or less."  (5 文字)
```
# アロー関数

アロー関数を使うと関数をより簡潔に書けます。

```js
const double = (x) => {
  return x * 2;
};

// return だけなら波括弧と return を省略できる
const double = (x) => x * 2;
```

## やってみよう

前の課題の `eat` 関数を**アロー関数**で書き直してください。
文字列 `food` を受け取り、`food + " tasted really good."` を返します。

```js
eat("apples"); // -> "apples tasted really good."
```
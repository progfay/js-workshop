# 解説

```js
function eat(food) {
  return food + " tasted really good.";
}
```

引数 `food` と文字列を `+` で結合して返します。
テンプレートリテラルで `` return `${food} tasted really good.`; `` と書いても同じです。

`return` を書き忘れると関数は `undefined` を返します。
その場合、テストのエラーメッセージに `undefined` と表示されるので、
「`undefined` が返ってきたら `return` 忘れを疑う」と覚えておきましょう。
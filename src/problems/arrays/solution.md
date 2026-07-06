# 解説

```js
const pizzaToppings = ["tomato sauce", "cheese", "pepperoni"];
```

配列はカンマ区切りの要素を角括弧で囲んで作ります。
`console.log(pizzaToppings.length)` とすると要素数の `3` が出力されます。

角括弧ごと引用符で囲んでしまうと、配列ではなく1つの文字列になってしまうので
注意しましょう（テストのエラーメッセージを見ると、全体が `"..."` で
囲まれていることから文字列になっているのがわかります）。
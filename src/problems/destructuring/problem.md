# 分割代入

分割代入を使うと、オブジェクトや配列から値を取り出して変数に代入できます。

```js
const { toppings } = pizza; // pizza.toppings を取り出す
const [first, second] = toppings; // 配列の先頭2つを取り出す
```

## やってみよう

`pizza` オブジェクトを受け取り、`pizza.toppings` の**先頭2要素を入れ替えた配列** `[2番目, 1番目]` を返す関数 `topTwo` を実装してください。分割代入を使ってみましょう。

```js
topTwo({ toppings: ["cheese", "sauce", "pepperoni"], crust: "deep dish", serves: 2 });
// -> ["sauce", "cheese"]
```
# オブジェクト

オブジェクトは、各要素を整数ではなく**キー**で識別する値の集まりです。

```js
const foodPreferences = {
  pizza: "yum",
  salad: "gross",
};
```

## やってみよう

変数 `pizza` を次のように定義してください。

```js
const pizza = {
  toppings: ["cheese", "sauce", "pepperoni"],
  crust: "deep dish",
  serves: 2,
};
```

`console.log(pizza)` でデバッグ出力できます。

> このテストはオブジェクトを JSON 文字列にして比較するので、
> プロパティは例と**同じ順**で書いてください。
> 失敗したときはエラーメッセージに期待値と実際の値が並ぶので、見比べて直しましょう。
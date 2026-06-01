# オブジェクトのプロパティ

プロパティの値はドット記法か角括弧で取得できます。

```js
const example = { pizza: "yummy" };
example.pizza; // -> "yummy"
example["pizza"]; // -> "yummy"
```

存在しないプロパティにアクセスすると `undefined` が返ります。
`undefined` かもしれない場合は Optional Chaining `?.` が使えます (`obj.a?.b`)。

## やってみよう

次のオブジェクト `food` が与えられています。

```js
const food = { types: "only pizza" };
```

`food` の `types` プロパティの値を変数 `types` に代入してください。
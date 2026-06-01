# オブジェクトのキー

`Object.keys()` はオブジェクトのキーをすべて文字列の配列で返します。

```js
const car = { make: "Toyota", model: "Camry", year: 2020 };
Object.keys(car); // -> ["make", "model", "year"]
```

## やってみよう

次のオブジェクト `car` が与えられています。

```js
const car = { make: "Honda", model: "Accord", year: 2020 };
```

`Object.keys(car)` の結果を変数 `keys` に代入してください。
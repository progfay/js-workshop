# 解説

```js
const car = { make: "Honda", model: "Accord", year: 2020 };
const keys = Object.keys(car); // -> ["make", "model", "year"]
```

キーは定義した順に並んだ文字列の配列になります。

仲間のメソッドも `console.log` で試してみましょう。

```js
Object.values(car); // -> ["Honda", "Accord", 2020]  (値の配列)
Object.entries(car); // -> [["make", "Honda"], ...]  (キーと値のペアの配列)
```
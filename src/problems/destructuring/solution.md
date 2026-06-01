# 解説

```js
function topTwo(pizza) {
  const { toppings } = pizza;
  const [first, second] = toppings;
  return [second, first];
}
```

オブジェクトの分割代入で `toppings` を取り出し、配列の分割代入で先頭2つを取り出しています。
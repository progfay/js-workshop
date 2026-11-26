# 解説

```ts
function topTwo(pizza: { toppings: string[] }): string[] {
  const { toppings } = pizza;
  const [first, second] = toppings;
  return [second, first];
}
```

オブジェクトの分割代入で `toppings` を取り出し、配列の分割代入で先頭2つを取り出しています。

慣れてくると、2つの分割代入をネストして1行にまとめることもできます。

```ts
function topTwo({ toppings: [first, second] }: { toppings: string[] }): string[] {
  return [second, first];
}
```

まずは解答例のように1段ずつ書くほうが読みやすく、デバッグもしやすいでしょう。
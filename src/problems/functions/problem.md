# 関数

関数は処理をまとめて名前を付けたものです。`return` で値を返します。

```ts
function double(x: number): number {
  return x * 2;
}
double(5); // -> 10
```

## やってみよう

文字列 `food` を受け取り、`food + " tasted really good."` を返す関数 `eat` を実装してください。

```ts
eat("bananas"); // -> "bananas tasted really good."
```
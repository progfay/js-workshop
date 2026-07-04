# 解説

```js
const makeCounter = () => {
  let count = 0;
  const increment = () => {
    count += 1;
    return count;
  };
  const decrement = () => {
    count -= 1;
    return count;
  };
  return [increment, decrement];
};
```

`count` は `makeCounter` のローカル変数ですが、返した `increment` / `decrement` が
クロージャとして覚えているので、呼び出しのたびに同じ `count` を読み書きできます。
`makeCounter()` を呼ぶたびに新しい `count` が作られるので、カウンタは独立します。

もし `let count = 0;` を `makeCounter` の**外**（グローバル）に置くと、
すべてのカウンタが1つの `count` を共有してしまい、
「別々の makeCounter() は独立している」のテストケース**だけ**が失敗します。
公開されているテストケースのどれが失敗したかを見ると、
実装のどこが間違っているのか絞り込めます。
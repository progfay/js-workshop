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
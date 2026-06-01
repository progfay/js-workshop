# 解説

```js
function evens(numbers) {
  return numbers.filter((n) => n % 2 === 0);
}
```

偶数の判定は `n % 2 === 0` です。`filter` は条件を満たす要素だけの新しい配列を返します。
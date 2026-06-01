# 解説

```js
function primeHexes(limit) {
  const numbers = [...Array(limit).keys()];
  const isPrime = (num) => {
    if (num < 2) return false;
    for (let i = 2; i < num; i++) {
      if (num % i === 0) return false;
    }
    return true;
  };
  return numbers.filter(isPrime).map((num) => num.toString(16));
}
```

`[...Array(limit).keys()]` で `0..limit-1` の配列を作り、`filter` で素数に絞り、
`map` で 16 進数文字列へ変換しています。
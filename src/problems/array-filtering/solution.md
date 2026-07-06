# 解説

```js
function evens(numbers) {
  return numbers.filter((n) => n % 2 === 0);
}
```

偶数の判定は `n % 2 === 0` です。`filter` は条件を満たす要素だけの**新しい配列**を返し、
元の `numbers` は変更しません。

`filter` を使わずに、前の課題のように `for...of` と `push` で書くこともできます。
両方で書いてみて、どちらもテストが通ることを確かめると理解が深まります。
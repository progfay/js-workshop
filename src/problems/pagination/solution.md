# 解説

```js
function getPageNums(current, total, size) {
  const s = current - Math.floor((size - 1) / 2);
  const start = s < 1 ? 1 : s + size > total ? total - size + 1 : s;
  return range(start, start + size);
}
```

まず `current` を中央に置いたときの開始位置 `s` を求めます。
`s` が `1` より小さければ `1` に、末尾をはみ出すなら `total - size + 1` に寄せ、
そうでなければ `s` をそのまま開始位置にします。最後に `range` で連続した番号を作ります。
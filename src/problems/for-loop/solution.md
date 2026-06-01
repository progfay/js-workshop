# 解説

```js
let total = 0;
const limit = 10;
for (let i = 0; i < limit; i++) {
  total += i;
}
// total -> 45  (0 + 1 + ... + 9)
```

`total` は再代入するので `let` で宣言します。`0` から `9` までの合計は `45` です。
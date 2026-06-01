# 解説

`secondFunction` の中に次の1行を置きます。

```js
result = `a: ${a}, b: ${b}, c: ${c}`;
```

その位置から見えるのは、

- `a` … どの内側スコープでも再宣言されていないので、グローバルの `1`
- `b` … `secondFunction` で宣言された `8`
- `c` … `secondFunction` には無いが、親の `firstFunction` で宣言された `6`

なので結果は `"a: 1, b: 8, c: 6"` になります。
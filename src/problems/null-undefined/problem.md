# null と undefined

「値が無い」ことを表す値が2種類あります。`null` と `undefined` です。

- `undefined` … 値がまだ代入されていない、存在しないプロパティなどで自動的に現れる
- `null` … 「意図的に空である」ことを明示するために代入する

```js
const obj = {};
obj.a; // -> undefined (存在しないプロパティ)
typeof null; // -> "object"
typeof undefined; // -> "undefined"
```

## `??` (Nullish coalescing)

`a ?? b` は、`a` が `null` または `undefined` のときだけ `b` を返します。
`||` と違い、`0` や `""`, `false` のような偽値はそのまま残ります。

```js
0 || "default"; // -> "default"  (0 は偽値なので置き換わる)
0 ?? "default"; // -> 0           (0 は null/undefined ではない)
```

## やってみよう

`value` が `null` または `undefined` のときだけ `fallback` を返し、
それ以外は `value` をそのまま返す関数 `getOrDefault` を実装してください。
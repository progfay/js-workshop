# 解説

```ts
const pets = ["cat", "dog", "rat"];
const plurals: string[] = [];
for (const pet of pets) {
  plurals.push(pet + "s");
}
// plurals -> ["cats", "dogs", "rats"]
```

`for...of` で各要素を取り出し、`+ "s"` で複数形にして `push` しています。
（`pets.map((pet) => pet + "s")` でも同じ結果になります。）
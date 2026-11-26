# 解説

```ts
const food = { types: "only pizza" };
const types = food.types; // -> "only pizza"
```

`food.types` でも `food["types"]` でも同じ値が取得できます。

角括弧が役立つのは、キーが変数に入っているときです。

```ts
const key = "types";
food[key]; // -> "only pizza"  (food.key では取れない)
```
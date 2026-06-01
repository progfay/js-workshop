# 解説

```js
function math(a, b, c) {
  return b * c + a;
}
```

`*` は `+` より優先されるので、`b * c` が先に計算され、その後 `a` が足されます。
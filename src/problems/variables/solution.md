# 解説

```js
const language = "JavaScript";

let mood = "bored";
mood = "excited";
```

`let` で宣言した変数は、`=` だけで何度でも再代入できます。

`mood` を `const` で宣言したまま再代入しようとすると、
`TypeError` が発生してテストが失敗します。
このアプリではエラーメッセージがそのまま表示されるので、
気になる挙動はエディタで試して確かめてみましょう。

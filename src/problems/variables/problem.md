# 変数

変数は値に付ける名前です。`const` や `let` を使って宣言します。

```js
const example = "some string";
```

`const` で宣言した変数には**再代入できません**。`let` は再代入できます。

```js
let count = 0;
count = 1; // OK (2回目からは let を付けずに = だけで代入する)

const fixed = 0;
fixed = 1; // TypeError! (const には再代入できない)
```

意図しない再代入を防ぐため、基本的には `const` を使い、再代入が必要なときだけ `let` を使いましょう。

## やってみよう

1. `const` で宣言された変数 `language` に、文字列 `"JavaScript"` を代入してください。
2. `let` で宣言済みの変数 `mood` に、文字列 `"excited"` を**再代入**してください。

書けたら、`mood` の `let` を `const` に変えて実行してみましょう。
再代入がエラーになる様子を、実行結果のパネルで確認できます（確認したら `let` に戻してください）。

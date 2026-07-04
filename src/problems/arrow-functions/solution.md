# 解説

```js
const eat = (food) => food + " tasted really good.";
```

`return` だけの関数なので、波括弧と `return` を省略した一行で書けます。

注意したいのは、**波括弧を書いたら `return` は省略できない**ことです。

```js
const eat = (food) => {
  food + " tasted really good."; // return が無いので undefined が返る!
};
```

この形で実行するとテストに `undefined` と表示されて失敗します。
実際に試して、エラーメッセージを見比べてみましょう。
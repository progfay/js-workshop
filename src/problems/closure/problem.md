# クロージャ

関数は、自分が定義されたスコープの変数を覚えています。これを**クロージャ**と呼びます。
外からは直接見えない変数を、返した関数を通して操作できます。

## やってみよう

呼ぶたびにカウンタを操作する関数のペアを返す関数 `makeCounter` を実装してください。

- `makeCounter()` は `[increment, decrement]` の配列を返す
- `increment()` … カウンタを 1 増やし、増やした後の値を返す
- `decrement()` … カウンタを 1 減らし、減らした後の値を返す
- カウンタは `0` から始まる
- `makeCounter()` を複数回呼ぶと、それぞれ独立したカウンタになる

```js
const [increment, decrement] = makeCounter();
increment(); // -> 1
increment(); // -> 2
decrement(); // -> 1
```
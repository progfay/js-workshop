# 解説

```js
function fizzbuzz(n) {
  if (n % 15 === 0) return "FizzBuzz";
  if (n % 3 === 0) return "Fizz";
  if (n % 5 === 0) return "Buzz";
  return n;
}
```

`% 15 === 0`（= 3 でも 5 でも割り切れる）を最初に判定しないと、
`15` のときに先に `"Fizz"` が返ってしまいます。条件の順序が重要です。
試しに `% 15` の行を最後に動かして実行すると、`fizzbuzz(15)` と `fizzbuzz(30)` の
テストケースだけが失敗するのが確認できます。

最初の条件は `n % 3 === 0 && n % 5 === 0` と書いても同じ意味です。
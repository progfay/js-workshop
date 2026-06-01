# 解説

```js
function extractZipcodes(text) {
  const regex = /[^\d-]\d{7}[^\d-]|[^\d-]\d{3}-\d{4}[^\d-]/g;
  return (text.match(regex) || []).map((code) => code.trim());
}
```

`\d{7}` と `\d{3}-\d{4}` の2パターンを `|` で繋いでいます。
前後を `[^\d-]`（数字でもハイフンでもない文字）で挟むことで、
8 桁以上や区切りが余分なものを弾いています。一致部分には前後の文字が含まれるので `trim` します。
`match` は一致が無いと `null` を返すため `|| []` で空配列にしています。
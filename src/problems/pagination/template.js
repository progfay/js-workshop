/**
 * @description `range` 関数はこのまま使ってください。
 * @example range(2, 5); // [2, 3, 4]
 */
function range(start, end) {
  if (start > end) {
    throw new Error(
      `range 関数の第一引数 \`start\` は第二引数 \`end\` の値以下である必要があります (start: ${start}, end: ${end})`,
    );
  }
  return new Array(end - start).fill(0).map((_, i) => i + start);
}

// current をできるだけ中央に置いた size 個のページ番号配列を返す関数 getPageNums を実装してください。
function getPageNums(current, total, size) {
  // ここに実装してください
}
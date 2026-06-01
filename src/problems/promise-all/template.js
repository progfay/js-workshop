// 非同期に n の 2 乗を返す関数。変更しないでください。
function fetchSquare(n) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(n * n), 1000);
  });
}

// numbers の各要素を 2 乗した配列を Promise.all で返す関数 squareAll を実装してください。
function squareAll(numbers) {
  // ここに実装してください
}